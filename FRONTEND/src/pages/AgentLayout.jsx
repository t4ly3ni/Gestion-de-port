import React from 'react';
import AgentSidebar from '../components/AgentSidebar';
import { Outlet } from 'react-router-dom';

const AgentLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <AgentSidebar />
      <main className="flex-1 ml-16 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentLayout;
