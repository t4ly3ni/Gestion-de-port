import React from 'react';
import { useAuth } from '../context/authcontext.jsx';

const Navbar = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <nav className="w-full bg-blue-800 text-white px-6 py-3 flex justify-end items-center shadow">
      <span className="font-semibold mr-4">{user.name}</span>
      <span className="bg-blue-600 rounded px-3 py-1 text-sm uppercase tracking-wide">{user.role}</span>
    </nav>
  );
};

export default Navbar;
