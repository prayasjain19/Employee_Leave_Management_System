import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ className }) => {
    return (
        <aside className={`p-4 ${className || ''} bg-white border-r min-h-screen`}>
            <nav className="space-y-2">
                <NavLink to="/dashboard" className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>Dashboard</NavLink>
                <NavLink to="/leave-form" className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>Apply Leave</NavLink>
                <NavLink to="/my-leaves" className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>My Leaves</NavLink>
                <NavLink to="/balance" className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>My Balance</NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `block p-3 rounded-lg ${isActive ? 'bg-teal-50 border border-teal-100' : 'hover:bg-gray-50'}`}>Calendar</NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;
