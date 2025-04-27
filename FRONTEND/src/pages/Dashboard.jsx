import react from 'react'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
    return (
        <div className='flex'>
            <Sidebar className="flex" />
            <div className='flex-1 ml-26 md:ml-64 bg-gray-100 min-h-screen '>
                <Outlet />
            </div>
        </div>
    )
}
export default Dashboard;
