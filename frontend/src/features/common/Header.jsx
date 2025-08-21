import React, { useContext } from 'react';
import { AuthContext } from '../auth/authContext';
import apiClient from './apiClient';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);


  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-white border-b">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-2 rounded-md hover:bg-gray-100">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div>
            <div className="text-md font-semibold">Employee Leave System</div>
            <div className="text-xs text-gray-500">Employee Leave Management</div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Hi, <span className="font-semibold">Welcome Back</span></div>
        <button onClick={logout} className="px-3 py-1 rounded-md text-sm text-red-600 hover:bg-red-50 border border-red-100">Logout</button>
      </div>
    </header>
  );
};

export default Header;
