import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertListModal = ({ open, onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios.get('/api/alerte').then(res => {
        setAlerts(res.data.alertes || []);
      }).finally(() => setLoading(false));
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-blue-700">&times;</button>
        <h2 className="text-2xl font-bold mb-4 text-blue-900">Liste des alertes</h2>
        {loading ? (
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
  );
};

export default AlertListModal;
