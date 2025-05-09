import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialForm = { nom: '', etat: '' };

const AdminQuais = () => {
  const [form, setForm] = useState(initialForm);
  const [poste, setPoste] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const editNomRef = useRef(null);

  const fetchPoste = async () => {
    try {
      const res = await axios.get('/api/poste');
      setPoste(res.data.postes || []);
    } catch (err) {
      setError('Erreur lors du chargement du poste.');
    }
  };

  useEffect(() => {
    fetchPoste();
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
      await axios.post('/api/poste', form);
      setSuccess('Poste ajouté avec succès!');
      setForm(initialForm);
      fetchPoste();
    } catch (err) {
      setError("Erreur lors de l'ajout du poste.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce poste ?')) return;
    try {
      await axios.delete(`/api/poste/${id}`);
      setSuccess('Poste supprimé.');
      fetchPoste();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  const startEdit = (posteItem) => {
    setEditingId(posteItem._id);
    setEditForm({ nom: posteItem.nom, etat: posteItem.etat });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/poste/${editingId}`, editForm);
      setSuccess('Poste modifié avec succès!');
      setEditingId(null);
      fetchPoste();
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
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Gérer le quai</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
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
        <div className="md:col-span-2 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Ajout...' : 'Ajouter le poste'}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-2 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-2 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Liste des postes</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Nom</th>
              <th className="py-5 px-8 text-left">État</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {poste.map(posteItem => (
              <tr key={posteItem._id} className={`border-b ${editingId === posteItem._id ? 'bg-blue-50' : ''} hover:bg-blue-50 transition-colors`}>
                {editingId === posteItem._id ? (
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
                    <td className="py-3 px-6 text-lg font-semibold">{posteItem.nom}</td>
                    <td className="py-3 px-6 text-lg">{posteItem.etat}</td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(posteItem)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-700 shadow"
                      >Modifier</button>
                      <button
                        onClick={() => handleDelete(posteItem._id)}
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

export default AdminQuais;
