import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Sidebar />
      <main className="flex-1 ml-16 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
