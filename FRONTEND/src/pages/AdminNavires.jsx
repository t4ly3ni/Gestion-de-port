import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialForm = {
  nom: '',
  etat: '',
  type: '',
  heure_arrivee: '',
  heure_depart: '',
  poste: '',
};

const AdminNavires = () => {
  const [form, setForm] = useState(initialForm);
  const [navires, setNavires] = useState([]);
  const [postes, setPostes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const editNomRef = useRef(null);

  const fetchNavires = async () => {
    try {
      const res = await axios.get('/api/navire');
      setNavires(res.data.navires || []);
    } catch (err) {
      setError('Erreur lors du chargement des navires.');
    }
  };

  const fetchPostes = async () => {
    try {
      const res = await axios.get('/api/poste');
      setPostes(res.data.postes || []);
    } catch (err) {
      setError('Erreur lors du chargement des quais.');
    }
  };

  useEffect(() => {
    fetchNavires();
    fetchPostes();
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
      await axios.post('/api/navire', form);
      setSuccess('Navire ajouté avec succès!');
      setForm(initialForm);
      fetchNavires();
    } catch (err) {
      setError('Erreur lors de l\'ajout du navire.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce navire ?')) return;
    try {
      await axios.delete(`/api/navire/${id}`);
      setSuccess('Navire supprimé.');
      fetchNavires();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  const startEdit = (navire) => {
    setEditingId(navire._id);
    setEditForm({
      nom: navire.nom,
      etat: navire.etat,
      type: navire.type,
      heure_arrivee: navire.heure_arrivee ? navire.heure_arrivee.slice(0, 16) : '',
      heure_depart: navire.heure_depart ? navire.heure_depart.slice(0, 16) : '',
      poste: navire.poste?._id || navire.poste || '',
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/navire/${editingId}`, editForm);
      setSuccess('Navire modifié avec succès!');
      setEditingId(null);
      fetchNavires();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Erreur lors de la modification.');
      setTimeout(() => setError(''), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-16 bg-gradient-to-br from-blue-100 to-blue-50 p-14 rounded-3xl shadow-2xl border border-blue-200">
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Gérer les navires</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Nom</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">État</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="etat"
            value={form.etat}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Type</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Heure d'arrivée</label>
          <input
            type="datetime-local"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="heure_arrivee"
            value={form.heure_arrivee}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Heure de départ</label>
          <input
            type="datetime-local"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="heure_depart"
            value={form.heure_depart}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Poste</label>
          <select
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="poste"
            value={form.poste}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un quai</option>
            {postes.map(poste => (
              <option key={poste._id} value={poste._id}>{poste.nom}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-3 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Ajout...' : 'Ajouter le navire'}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-3 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-3 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Liste des navires</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Nom</th>
              <th className="py-5 px-8 text-left">État</th>
              <th className="py-5 px-8 text-left">Type</th>
              <th className="py-5 px-8 text-left">Arrivée</th>
              <th className="py-5 px-8 text-left">Départ</th>
              <th className="py-5 px-8 text-left">Poste</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {navires.map(navire => (
              <tr key={navire._id} className={`border-b ${editingId === navire._id ? 'bg-blue-50' : ''} hover:bg-blue-50 transition-colors`}>
                {editingId === navire._id ? (
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
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="etat"
                        value={editForm.etat}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="type"
                        value={editForm.type}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="datetime-local"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="heure_arrivee"
                        value={editForm.heure_arrivee}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="datetime-local"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="heure_depart"
                        value={editForm.heure_depart}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <select
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="poste"
                        value={editForm.poste}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Sélectionner un quai</option>
                        {postes.map(poste => (
                          <option key={poste._id} value={poste._id}>{poste.nom}</option>
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
                    <td className="py-3 px-6 text-lg font-semibold">{navire.nom}</td>
                    <td className="py-3 px-6 text-lg">{navire.etat}</td>
                    <td className="py-3 px-6 text-lg">{navire.type}</td>
                    <td className="py-3 px-6 text-lg">{navire.heure_arrivee ? new Date(navire.heure_arrivee).toLocaleString() : ''}</td>
                    <td className="py-3 px-6 text-lg">{navire.heure_depart ? new Date(navire.heure_depart).toLocaleString() : ''}</td>
                    <td className="py-3 px-6 text-lg">{postes.find(p => p._id === navire.poste)?.nom || ''}</td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(navire)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-700 shadow"
                      >Modifier</button>
                      <button
                        onClick={() => handleDelete(navire._id)}
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

export default AdminNavires;
