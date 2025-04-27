import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const initialForm = {
  name: '',
  password: '',
  role: 'agent',
};

const AdminUtilisateurs = () => {
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const editNameRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/user');
      setUsers(res.data.users || []);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingId && editNameRef.current) {
      editNameRef.current.focus();
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
      await axios.post('/api/user', form);
      setSuccess('Utilisateur ajouté avec succès!');
      setForm(initialForm);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout de l\'utilisateur.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`/api/user/${id}`);
      setSuccess('Utilisateur supprimé.');
      fetchUsers();
    } catch (err) {
      setError('Erreur lors de la suppression.');
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, password: '', role: user.role });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.put(`/api/user/${editingId}`, editForm);
      setSuccess('Utilisateur modifié avec succès!');
      setEditingId(null);
      fetchUsers();
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
      <h2 className="text-5xl font-extrabold mb-14 text-blue-900 text-center tracking-tight drop-shadow">Gérer les utilisateurs</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-20 bg-white p-10 rounded-3xl shadow-lg border border-blue-100">
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Nom</label>
          <input
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Mot de passe</label>
          <input
            type="password"
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-xl font-bold text-blue-800">Rôle</label>
          <select
            className="w-full border-2 border-blue-400 rounded-xl px-5 py-4 text-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="md:col-span-5 flex items-end justify-end">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-12 py-4 rounded-2xl text-xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-colors w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Ajout...' : "Ajouter l'utilisateur"}
          </button>
        </div>
        {success && <div className="text-green-600 mt-4 text-xl md:col-span-5 text-center font-semibold">{success}</div>}
        {error && <div className="text-red-600 mt-4 text-xl md:col-span-5 text-center font-semibold">{error}</div>}
      </form>
      <h3 className="text-3xl font-bold mb-10 text-blue-800 text-center">Liste des utilisateurs</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-2 border-blue-200 rounded-2xl shadow-lg text-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-xl">
              <th className="py-5 px-8 text-left">Nom</th>
              <th className="py-5 px-8 text-left">Rôle</th>
              <th className="py-5 px-8 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className={`border-b ${editingId === user._id ? 'bg-blue-50' : ''} hover:bg-blue-50 transition-colors`}>
                {editingId === user._id ? (
                  <>
                    <td className="py-3 px-6">
                      <input
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        ref={editNameRef}
                        required
                        disabled={loading}
                      />
                    </td>
                    <td className="py-3 px-6">
                      <select
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="role"
                        value={editForm.role}
                        onChange={handleEditChange}
                        required
                        disabled={loading}
                      >
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <input
                        type="password"
                        className="border-2 border-blue-300 rounded-lg px-2 py-1 text-lg w-full bg-blue-50"
                        name="password"
                        value={editForm.password}
                        onChange={handleEditChange}
                        placeholder="Nouveau mot de passe (optionnel)"
                        disabled={loading}
                      />
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
                    <td className="py-3 px-6 text-lg font-semibold">{user.name}</td>
                    <td className="py-3 px-6 text-lg">{user.role}</td>
                    <td className="py-3 px-6 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => startEdit(user)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-700 shadow"
                      >Modifier</button>
                      <button
                        onClick={() => handleDelete(user._id)}
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

export default AdminUtilisateurs;
