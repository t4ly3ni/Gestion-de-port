import React from 'react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="max-w-3xl mx-auto mt-16 bg-white p-12 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-10 text-blue-900">Dashboard</h1>
      <span className="text-lg text-gray-700">Summary of dashboard</span>
    </div>
  );
};

export default Dashboard;
