import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialForm = {
  nom: '',
  capacite: '',
  marchandise: '',
  temps_de_chargement: '',
  temps_de_dechargement: '',
};

const AdminStockage = () => {
  const [form, setForm] = useState(initialForm);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const editNomRef = useRef(null);
  const [marchandises, setMarchandises] = useState([]);
  const [tempsList, setTempsList] = useState([]);
  const [showTempsForm, setShowTempsForm] = useState(false);
  const [tempsForm, setTempsForm] = useState({ temps_de_chargement: '', temps_de_dechargement: '' });
  const [tempsLoading, setTempsLoading] = useState(false);
  const [tempsError, setTempsError] = useState('');

  const fetchZones = async () => {
    try {
      const res = await axios.get('/api/zone_stockage');
      setZones(res.data.zones || []);
    } catch (err) {
      setError('Erreur lors du chargement des zones de stockage.');
    }
  };

  const fetchMarchandises = async () => {
    try {
      const res = await axios.get('/api/marchandise');
      setMarchandises(res.data.marchandises || []);
    } catch (err) {
      setError('Erreur lors du chargement des marchandises.');
    }
  };

  const fetchTemps = async () => {
    try {
      const res = await axios.get('/api/temps');
      setTempsList(res.data.temps || []);
    } catch (err) {
      setError('Erreur lors du chargement des temps.');
    }
  };

  useEffect(() => {
    fetchZones();
    fetchMarchandises();
    fetchTemps();
  }, []);

  useEffect(() => {
    if (editingId && editNomRef.current) {
      editNomRef.current.focus();
    }
  }, [editingId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Créer le temps d'abord
      const tempsRes = await axios.post('/api/temps', {
        temps_de_chargement: Number(form.temps_de_chargement),
        temps_de_dechargement: Number(form.temps_de_dechargement),
      });
      const tempsId = tempsRes.data.temps._id;
      await axios.post('/api/zone_stockage', {
        nom: form.nom,
        capacite: Number(form.capacite),
        marchandise: form.marchandise,
        temps: tempsId,
      });
      setSuccess('Zone de stockage ajoutée avec succès!');
      setForm(initialForm);
      fetchZones();
    } catch (err) {
      setError("Erreur lors de l'ajout de la zone.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette zone de stockage ?')) return;
    try {
      await axios.delete(`/api/zone_stockage/${id}`);
      setSuccess('Zone supprimée.');
      fetchZones();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  const startEdit = (z) => {
    setEditingId(z._id);
    setEditForm({
      nom: z.nom,
      capacite: z.capacite,
      marchandise: z.marchandise,
      temps: z.temps,
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/zone_stockage/${editingId}`, {
        ...editForm,
        capacite: Number(editForm.capacite),
      });
      setSuccess('Zone modifiée avec succès!');
      setEditingId(null);
      fetchZones();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Erreur lors de la modification.');
      setTimeout(() => setError(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleTempsChange = (e) => {
    setTempsForm({ ...tempsForm, [e.target.name]: e.target.value });
  };

  const handleAddTemps = async (e) => {
    e.preventDefault();
    setTempsLoading(true);
    setTempsError('');
    try {
      const res = await axios.post('/api/temps', {
        temps_de_chargement: Number(tempsForm.temps_de_chargement),
        temps_de_dechargement: Number(tempsForm.temps_de_dechargement),
      });
      await fetchTemps();
      setForm(f => ({ ...f, temps: res.data.temps._id }));
      setTempsForm({ temps_de_chargement: '', temps_de_dechargement: '' });
      setShowTempsForm(false);
    } catch (err) {
      setTempsError('Erreur lors de l\'ajout du temps.');
    } finally {
      setTempsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 bg-gradient-to-br from-blue-100 to-blue-50 p-14 rounded-3xl shadow-2xl border border-blue-200">
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Gérer les zones de stockage</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
        <div className="md:col-span-2 flex flex-col items-center md:mr-4">
          <label className="block mb-2 text-xl font-bold text-blue-800 text-center">Nom</label>
          <input
            className="w-full min-w-[220px] md:min-w-[250px] border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50 text-center"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="md:col-span-2 flex flex-col items-center md:mx-2">
          <label className="block mb-2 text-xl font-bold text-blue-800 text-center">Capacité</label>
          <input
            type="number"
            className="w-full min-w-[220px] md:min-w-[250px] border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50 text-center"
            name="capacite"
            value={form.capacite}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="md:col-span-2 flex flex-col items-center md:ml-4">
          <label className="block mb-2 text-xl font-bold text-blue-800 text-center">Marchandise</label>
          <select
            className="w-full min-w-[220px] md:min-w-[250px] border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50 text-center"
            name="marchandise"
            value={form.marchandise || ''}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner une marchandise</option>
            {marchandises.map(m => (
              <option key={m._id} value={m._id}>{m.type}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="block mb-2 text-xl font-bold text-blue-800">Chargement</label>
          <input
            type="number"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="temps_de_chargement"
            value={form.temps_de_chargement}
            onChange={handleChange}
            required
            min="0"
            placeholder="ex: 30"
          />
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="block mb-2 text-xl font-bold text-blue-800">Déchargement</label>
          <input
            type="number"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="temps_de_dechargement"
            value={form.temps_de_dechargement}
            onChange={handleChange}
            required
            min="0"
            placeholder="ex: 45"
          />
        </div>
        <div className="md:col-span-6 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Ajout...' : 'Ajouter la zone'}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-6 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-6 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Liste des zones de stockage</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Nom</th>
              <th className="py-5 px-8 text-left">Capacité</th>
              <th className="py-5 px-8 text-left">Marchandise</th>
              <th className="py-5 px-8 text-left">Temps</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {zones.map(z => (
              <tr key={z._id} className={`border-b ${editingId === z._id ? 'bg-blue-50' : ''} hover:bg-blue-50 transition-colors`}>
                {editingId === z._id ? (
                  <>
                    <td className="py-3 px-6">
                      <input
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="nom"
                        value={editForm.nom}
                        onChange={handleEditChange}
                        ref={editNomRef}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="number"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="capacite"
                        value={editForm.capacite}
                        onChange={handleEditChange}
                        required
                        min="0"
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <select
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="marchandise"
                        value={editForm.marchandise || ''}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Sélectionner une marchandise</option>
                        {marchandises.map(m => (
                          <option key={m._id} value={m._id}>{m.type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-6">
                      <select
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="temps"
                        value={editForm.temps || ''}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Sélectionner un temps</option>
                        {tempsList.map(t => (
                          <option key={t._id} value={t._id}>{`Chargement: ${t.temps_de_chargement} / Déchargement: ${t.temps_de_dechargement}`}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={handleEdit}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-700 shadow"
                        disabled={loading}
                      >
                        {loading ? '...' : 'Enregistrer'}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="ml-2 text-gray-500 text-lg hover:text-blue-700"
                        disabled={loading}
                      >Annuler</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6 text-lg font-semibold">{z.nom}</td>
                    <td className="py-3 px-6 text-lg">{z.capacite}</td>
                    <td className="py-3 px-6 text-lg">{marchandises.find(m => m._id === z.marchandise)?.type || ''}</td>
                    <td className="py-3 px-6 text-lg">{(() => { const t = tempsList.find(t => t._id === z.temps); return t ? `Chargement: ${t.temps_de_chargement} / Déchargement: ${t.temps_de_dechargement}` : ''; })()}</td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(z)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-700 shadow"
                      >Modifier</button>
                      <button
                        onClick={() => handleDelete(z._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-red-700 shadow"
                      >Supprimer</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminStockage;
