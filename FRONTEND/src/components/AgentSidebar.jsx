import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ActivitySquare, LogOut } from "lucide-react";
import { useAuth } from '../context/authcontext.jsx';

const AgentSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const menuItems = [
        { label: "Tableau de bord", icon: <LayoutDashboard />, path: "/user/dashboard" },
        { label: "Prédire la congestion", icon: <ActivitySquare />, path: "/user/dashboard/predict-congestion" },
    ];
    return (
        <div className='flex flex-col h-screen bg-blue-900 text-white w-16 md:w-64 fixed'>
            <div className='h-16 flex flex-items justify-center pt-6'>
                <span className='hidden md:block text-xl font-bold'>Agent Port</span>
                <span className='md:hidden text-xl font-bold'>AGT</span>
            </div>
            <div>
                <ul className='space-y-2 p-2'>
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            <NavLink className={({ isActive }) => (isActive ? "bg-gray-700 text-white flex items-center p-2 rounded-md" : "flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-white")} to={item.path}>
                                <span className='text-xl'>{item.icon}</span>
                                <span className='hidden md:block'>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                    <li>
                        <button
                            className="flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-white w-full mt-8"
                            onClick={async () => { await logout(); navigate('/login'); }}
                        >
                            <span className='text-xl'><LogOut /></span>
                            <span className='hidden md:block'>Se déconnecter</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AgentSidebar;
