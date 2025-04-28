import React from 'react';

const NotificationPopup = ({ alert, onClose, onConsulter }) => {
  if (!alert) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-blue-700 text-white px-6 py-4 rounded-xl shadow-lg animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="font-bold text-lg">Nouvelle alerte</div>
        <div className="font-semibold">{alert.type} - {alert.niveau}</div>
        <div className="text-sm mt-1">{alert.message}</div>
        <div className="flex gap-2 mt-2">
          <button onClick={onConsulter} className="bg-white text-blue-700 font-bold px-4 py-1 rounded hover:bg-blue-100 transition">Consulter les alertes</button>
          <button onClick={onClose} className="text-white text-2xl font-bold hover:text-gray-200">&times;</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
