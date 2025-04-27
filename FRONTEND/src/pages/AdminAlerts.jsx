import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAlerts = () => {
  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [niveau, setNiveau] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [fetching, setFetching] = useState(false);

  const fetchAlerts = async () => {
    setFetching(true);
    try {
      const res = await axios.get('/api/alerte');
      setAlerts(res.data.alertes || []);
    } catch (err) {
      setError('Erreur lors du chargement des alertes.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await axios.post('/api/alerte', { type, message, niveau });
      if (res.data.success) {
        setSuccess('Alerte créée avec succès!');
        setType('');
        setMessage('');
        setNiveau('');
        fetchAlerts();
      } else {
        setError('Erreur lors de la création de l\'alerte.');
      }
    } catch (err) {
      setError('Erreur lors de la création de l\'alerte.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette alerte ?')) return;
    try {
      await axios.delete(`/api/alerte/${id}`);
      setSuccess('Alerte supprimée.');
      fetchAlerts();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 bg-gradient-to-br from-blue-100 to-blue-50 p-14 rounded-3xl shadow-2xl border border-blue-200">
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Créer une alerte</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Type</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Message</label>
          <textarea
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={2}
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Niveau</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            value={niveau}
            onChange={e => setNiveau(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-3 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer l\'alerte'}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-3 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-3 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Alertes existantes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Type</th>
              <th className="py-5 px-8 text-left">Niveau</th>
              <th className="py-5 px-8 text-left">Message</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr><td colSpan={4} className="text-center py-6">Chargement...</td></tr>
            ) : alerts.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6">Aucune alerte.</td></tr>
            ) : (
              alerts.map(alert => (
                <tr key={alert._id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="py-3 px-6 text-lg font-semibold">{alert.type}</td>
                  <td className="py-3 px-6 text-lg">{alert.niveau}</td>
                  <td className="py-3 px-6 text-lg">{alert.message}</td>
                  <td className="py-3 px-6 text-center flex gap-2 justify-center">
                    <button
                      onClick={() => handleDelete(alert._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-red-700 shadow"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;
