import React from 'react';
import { NavLink } from 'react-router-dom';
import {LayoutDashboard,ActivitySquare,Bell,Anchor,Ship,Users,Package, Warehouse} from "lucide-react";

const Sidebar = () => {
    const menuItems = [
        { label: "Tableau de bord", icon: <LayoutDashboard />, path: "/admin/dashboard" },
        { label: "Prédire la congestion", icon: <ActivitySquare />, path: "/admin/dashboard/predict-congestion" },
        { label: "Consulter les alertes", icon: <Bell />, path: "/admin/dashboard/alerts" },
        { label: "Gérer les quais", icon: <Anchor />, path: "/admin/dashboard/quais" },
        { label: "Gérer les navires", icon: <Ship />, path: "/admin/dashboard/navires" },
        { label: "Gérer les utilisateurs", icon: <Users />, path: "/admin/dashboard/utilisateurs" },
        { label: "Gérer les marchandises", icon: <Package />, path: "/admin/dashboard/marchandises" },
        { label: "Gérer le stockage", icon: <Warehouse />, path: "/admin/dashboard/stockage" },
      ];
  return (
    <div className='flex flex-col h-screen bg-blue-900 text-white w-16 md:w-64 fixed'>
        <div className='h-16 flex flex-items justify-center pt-6'>
            <span className='hidden md:block text-xl font-bold'>Management Du Port</span>
            <span className='md:hidden text-xl font-bold'>MDP</span>
        </div>

        <div>
            <ul className='space-y-2 p-2'>
                {menuItems.map((item, index) => (
                    <li key={item.label}>
        
                        <NavLink className={({ isActive }) => (isActive ? "bg-gray-700 text-white flex items-center p-2 rounded-md" : "flex items-center p-2 rounded-md hover:bg-gray-700 hover:text-white")} to={item.path}>
                            <span className='text-xl'>{item.icon}</span>
                            <span className='hidden md:block'>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>

    </div>
  );
};

export default Sidebar;