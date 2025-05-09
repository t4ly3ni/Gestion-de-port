import React, { useState } from 'react';

const AdminPredictCongestion = () => {
  const [date, setDate] = useState('');
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPredictions(null);
    try {
      const res = await fetch('http://localhost:3000/api/congestion/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate: date, days: Number(days) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la prédiction');
      setPredictions(data.predictions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white p-12 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-10 text-blue-900">Prédire la congestion</h2>
      <form className="flex flex-col gap-6 mb-8" onSubmit={handlePredict}>
        <label className="flex flex-col gap-2">
          Date de début de prévision
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2">
          Nombre de jours à prédire
          <input type="number" min={1} max={30} value={days} onChange={e => setDays(e.target.value)} className="border rounded px-3 py-2 w-32" />
        </label>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800" disabled={loading}>
          {loading ? 'Prédiction en cours...' : 'Prédire'}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {predictions && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Résultats de la prédiction</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Congestion Prédite</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{p.date}</td>
                  <td className="border px-4 py-2">{p.congestion_predite.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPredictCongestion;
