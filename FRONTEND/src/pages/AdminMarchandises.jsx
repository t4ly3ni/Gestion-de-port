import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialForm = {
  type: '',
  nombre: '',
  poids: '',
  categories: '', // comma-separated string for input, will be split to array
  navire: '',
};

const AdminMarchandises = () => {
  const [form, setForm] = useState(initialForm);
  const [marchandises, setMarchandises] = useState([]);
  const [navires, setNavires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const editTypeRef = useRef(null);

  const fetchMarchandises = async () => {
    try {
      const res = await axios.get('/api/marchandise');
      setMarchandises(res.data.marchandises || []);
    } catch (err) {
      setError('Erreur lors du chargement des marchandises.');
    }
  };

  const fetchNavires = async () => {
    try {
      const res = await axios.get('/api/navire');
      setNavires(res.data.navires || []);
    } catch (err) {
      setError('Erreur lors du chargement des navires.');
    }
  };

  useEffect(() => {
    fetchMarchandises();
    fetchNavires();
  }, []);

  useEffect(() => {
    if (editingId && editTypeRef.current) {
      editTypeRef.current.focus();
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
      await axios.post('/api/marchandise', {
        ...form,
        nombre: Number(form.nombre),
        poids: Number(form.poids),
        categories: form.categories.split(',').map(c => c.trim()).filter(Boolean),
      });
      setSuccess('Marchandise ajoutée avec succès!');
      setForm(initialForm);
      fetchMarchandises();
    } catch (err) {
      setError('Erreur lors de l\'ajout de la marchandise.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette marchandise ?')) return;
    try {
      await axios.delete(`/api/marchandise/${id}`);
      setSuccess('Marchandise supprimée.');
      fetchMarchandises();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditForm({
      type: m.type,
      nombre: m.nombre,
      poids: m.poids,
      categories: m.categories.join(', '),
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/marchandise/${editingId}`, {
        ...editForm,
        nombre: Number(editForm.nombre),
        poids: Number(editForm.poids),
        categories: editForm.categories.split(',').map(c => c.trim()).filter(Boolean),
      });
      setSuccess('Marchandise modifiée avec succès!');
      setEditingId(null);
      fetchMarchandises();
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
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Gérer les marchandises</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
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
          <label className="block mb-2 text-xl font-bold text-blue-800">Nombre</label>
          <input
            type="number"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Poids (kg)</label>
          <input
            type="number"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="poids"
            value={form.poids}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="flex flex-col justify-end h-full">
          <label className="block mb-2 text-xl font-bold text-blue-800">
            Catégories
          </label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50 placeholder:text-blue-400 placeholder:italic shadow-sm h-[58px]"
            name="categories"
            value={form.categories}
            onChange={handleChange}
            required
            placeholder="ex: Alimentaire, Chimique, Textile"
            aria-label="Catégories séparées par des virgules"
            style={{ minHeight: '58px', marginTop: 0 }}
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Navire</label>
          <select
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="navire"
            value={form.navire || ''}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner un navire</option>
            {navires.map(n => (
              <option key={n._id} value={n._id}>{n.nom}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-5 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Ajout...' : 'Ajouter la marchandise'}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-5 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-5 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Liste des marchandises</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Type</th>
              <th className="py-5 px-8 text-left">Nombre</th>
              <th className="py-5 px-8 text-left">Poids (kg)</th>
              <th className="py-5 px-8 text-left">Catégories</th>
              <th className="py-5 px-8 text-left">Navire</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marchandises.map(m => (
              <tr key={m._id} className={`border-b ${editingId === m._id ? 'bg-blue-50' : ''} hover:bg-blue-50 transition-colors`}>
                {editingId === m._id ? (
                  <>
                    <td className="py-3 px-6">
                      <input
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="type"
                        value={editForm.type}
                        onChange={handleEditChange}
                        ref={editTypeRef}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="number"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditChange}
                        required
                        min="0"
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        type="number"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="poids"
                        value={editForm.poids}
                        onChange={handleEditChange}
                        required
                        min="0"
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <input
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="categories"
                        value={editForm.categories}
                        onChange={handleEditChange}
                        required
                        placeholder="ex: Alimentaire, Chimique"
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <select
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="navire"
                        value={editForm.navire || ''}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      >
                        <option value="">Sélectionner un navire</option>
                        {navires.map(n => (
                          <option key={n._id} value={n._id}>{n.nom}</option>
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
                    <td className="py-3 px-6 text-lg font-semibold">{m.type}</td>
                    <td className="py-3 px-6 text-lg">{m.nombre}</td>
                    <td className="py-3 px-6 text-lg">{m.poids}</td>
                    <td className="py-3 px-6 text-lg">{m.categories.join(', ')}</td>
                    <td className="py-3 px-6 text-lg">{navires.find(n => n._id === m.navire)?.nom || ''}</td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(m)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-700 shadow"
                      >Modifier</button>
                      <button
                        onClick={() => handleDelete(m._id)}
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

export default AdminMarchandises;
