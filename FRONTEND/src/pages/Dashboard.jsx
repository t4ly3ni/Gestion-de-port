import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import AlertListModal from '../components/AlertListModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [postes, setPostes] = useState([]);
  const [zones, setZones] = useState([]);
  const [navires, setNavires] = useState([]);
  const [marchandises, setMarchandises] = useState([]);
  const [tempsList, setTempsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAlertsList, setShowAlertsList] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posteRes, zoneRes, navireRes, marchandiseRes, tempsRes] = await Promise.all([
          axios.get('/api/poste'),
          axios.get('/api/zone_stockage'),
          axios.get('/api/navire'),
          axios.get('/api/marchandise'),
          axios.get('/api/temps'),
        ]);
        setPostes(posteRes.data.postes || []);
        setZones(zoneRes.data.zones || []);
        setNavires(navireRes.data.navires || []);
        setMarchandises(marchandiseRes.data.marchandises || []);
        setTempsList(tempsRes.data.temps || []);
      } catch (err) {
        setError('Erreur lors du chargement des données du dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const occupied = postes.filter(p => p.etat && p.etat.toLowerCase() !== 'libre').length;
  const free = postes.length - occupied;
  const portOccupancyData = {
    labels: ['Occupé', 'Libre'],
    datasets: [
      {
        label: 'Quais',
        data: [occupied, free],
        backgroundColor: ['#2563eb', '#60a5fa'],
      },
    ],
  };

  const zoneLabels = zones.map(z => z.nom);
  const zoneCapacities = zones.map(z => z.capacite);
  const storageZoneData = {
    labels: zoneLabels,
    datasets: [
      {
        label: 'Capacité',
        data: zoneCapacities,
        backgroundColor: '#38bdf8',
      },
    ],
  };

  const getPosteNom = (id) => {
    const p = postes.find(p => p._id === id);
    return p ? p.nom : id;
  };
  const getNavireNom = (id) => {
    const n = navires.find(n => n._id === id);
    return n ? n.nom : id;
  };
  const getMarchandiseType = (id) => {
    const m = marchandises.find(m => m._id === id);
    return m ? m.type : id;
  };
  const getTempsValue = (id) => {
    const t = tempsList.find(t => t._id === id);
    return t ? `Chargement: ${t.temps_de_chargement} / Déchargement: ${t.temps_de_dechargement}` : id;
  };

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-12 rounded-2xl shadow-lg">
      <div className="flex flex-wrap gap-4 mb-8">
        <button onClick={() => setShowAlertsList(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Consulter les alertes</button>
      </div>
      <AlertListModal open={showAlertsList} onClose={() => setShowAlertsList(false)} />
      <h1 className="text-3xl font-bold mb-10 text-blue-900">Dashboard</h1>
      {loading ? (
        <div className="text-center text-blue-700">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1 bg-blue-50 rounded-xl p-4 shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">Taux d'occupation du quai</h2>
              <Pie data={portOccupancyData} />
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-4 shadow">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">Utilisation des zones de stockage</h2>
              <Bar data={storageZoneData} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-4 shadow overflow-x-auto mt-6">
              <h3 className="text-lg font-bold mb-4 text-blue-900">Liste des postes</h3>
              <div className="w-full min-w-[600px]">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 text-lg">
                      <th className="py-4 px-6 text-left rounded-tl-xl">Nom</th>
                      <th className="py-4 px-6 text-left rounded-tr-xl">État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postes.map((p, idx) => (
                      <tr key={p._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}>
                        <td className="py-3 px-6 font-semibold rounded-l-xl">{p.nom}</td>
                        <td className="py-3 px-6 rounded-r-xl">{p.etat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow overflow-x-auto mt-6">
              <h3 className="text-lg font-bold mb-4 text-blue-900">Liste des navires</h3>
              <div className="w-full min-w-[700px]">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 text-lg">
                      <th className="py-4 px-6 text-left rounded-tl-xl">Nom</th>
                      <th className="py-4 px-6 text-left">État</th>
                      <th className="py-4 px-6 text-left">Type</th>
                      <th className="py-4 px-6 text-left">Heure arrivée</th>
                      <th className="py-4 px-6 text-left">Heure départ</th>
                      <th className="py-4 px-6 text-left rounded-tr-xl">Poste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {navires.map((n, idx) => (
                      <tr key={n._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}>
                        <td className="py-3 px-6 font-semibold rounded-l-xl">{n.nom}</td>
                        <td className="py-3 px-6">{n.etat}</td>
                        <td className="py-3 px-6">{n.type}</td>
                        <td className="py-3 px-6">{n.heure_arrivee ? new Date(n.heure_arrivee).toLocaleString() : ''}</td>
                        <td className="py-3 px-6">{n.heure_depart ? new Date(n.heure_depart).toLocaleString() : ''}</td>
                        <td className="py-3 px-6 rounded-r-xl">{getPosteNom(n.poste)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow overflow-x-auto mt-6">
              <h3 className="text-lg font-bold mb-4 text-blue-900">Liste des marchandises</h3>
              <div className="w-full min-w-[700px]">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 text-lg">
                      <th className="py-4 px-6 text-left rounded-tl-xl">Type</th>
                      <th className="py-4 px-6 text-left">Nombre</th>
                      <th className="py-4 px-6 text-left">Poids</th>
                      <th className="py-4 px-6 text-left">Catégories</th>
                      <th className="py-4 px-6 text-left rounded-tr-xl">Navire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marchandises.map((m, idx) => (
                      <tr key={m._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}>
                        <td className="py-3 px-6 font-semibold rounded-l-xl">{m.type}</td>
                        <td className="py-3 px-6">{m.nombre}</td>
                        <td className="py-3 px-6">{m.poids}</td>
                        <td className="py-3 px-6">{Array.isArray(m.categories) ? m.categories.join(', ') : m.categories}</td>
                        <td className="py-3 px-6 rounded-r-xl">{getNavireNom(m.navire)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 shadow overflow-x-auto mt-6">
              <h3 className="text-lg font-bold mb-4 text-blue-900">Liste des zones de stockage</h3>
              <div className="w-full min-w-[700px]">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-blue-100 text-blue-900 text-lg">
                      <th className="py-4 px-6 text-left rounded-tl-xl">Nom</th>
                      <th className="py-4 px-6 text-left">Capacité</th>
                      <th className="py-4 px-6 text-left">Marchandise</th>
                      <th className="py-4 px-6 text-left rounded-tr-xl">Temps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z, idx) => (
                      <tr key={z._id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100`}>
                        <td className="py-3 px-6 font-semibold rounded-l-xl">{z.nom}</td>
                        <td className="py-3 px-6">{z.capacite}</td>
                        <td className="py-3 px-6">{getMarchandiseType(z.marchandise)}</td>
                        <td className="py-3 px-6 rounded-r-xl">{getTempsValue(z.temps)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
