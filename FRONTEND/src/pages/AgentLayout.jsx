import React, { useEffect, useState } from 'react';
import AgentSidebar from '../components/AgentSidebar';
import { Outlet } from 'react-router-dom';
import NotificationPopup from '../components/NotificationPopup';
import { io } from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/Navbar';

const SOCKET_URL = 'http://localhost:3000';

const AgentLayout = () => {
  const [alert, setAlert] = useState(null);
  const [showAlertsList, setShowAlertsList] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id); // Debug log
    });
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
    socket.on('new_alert', (data) => {
      console.log('Received new_alert:', data); // Debug log
      setAlert(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Debug: show user info
    console.log('AgentLayout user:', localStorage.getItem('pos-user'));
  }, []);

  const fetchAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const res = await axios.get('/api/alerte');
      setAlerts(res.data.alertes || []);
    } finally {
      setLoadingAlerts(false);
    }
  };

  const handleConsulter = async () => {
    await fetchAlerts();
    setShowAlertsList(true);
    setAlert(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <AgentSidebar />
      <main className="flex-1 ml-16 md:ml-64">
        <Navbar />
        <NotificationPopup alert={alert} onClose={() => setAlert(null)} onConsulter={handleConsulter} />
        {showAlertsList && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
              <button onClick={() => setShowAlertsList(false)} className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-blue-700">&times;</button>
              <h2 className="text-2xl font-bold mb-4 text-blue-900">Liste des alertes</h2>
              {loadingAlerts ? (
                <div>Chargement...</div>
              ) : alerts.length === 0 ? (
                <div>Aucune alerte.</div>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {alerts.map(a => (
                    <li key={a._id} className="border-b pb-2">
                      <div className="font-semibold text-blue-800">{a.type} - {a.niveau}</div>
                      <div className="text-gray-700">{a.message}</div>
                      <div className="text-xs text-gray-500 mt-1">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
