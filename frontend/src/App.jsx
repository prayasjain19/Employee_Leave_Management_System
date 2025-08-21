import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './features/common/ProtectedRoute';
import Header from './features/common/Header';
import Sidebar from './features/common/Sidebar';
import { Toaster } from 'react-hot-toast';

// pages
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import LeaveForm from './features/leave/LeaveForm';
import LeaveList from './features/leave/LeaveList';
import Balance from './features/balance/Balance';
import CustomCalendar from './features/calendar/CustomCalendar';

function AppLayout({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="min-h-screen flex">
      {open && <div className="w-64"><Sidebar /></div>}
      <div className="flex-1 min-h-screen flex flex-col">
        <Header onToggleSidebar={() => setOpen(!open)} />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Employee','Manager']} />}>
        {/* Default redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={<AppLayout><Dashboard /></AppLayout>}
        />
        <Route
          path="/leave-form"
          element={<AppLayout><LeaveForm /></AppLayout>}
        />
        <Route
          path="/my-leaves"
          element={<AppLayout><LeaveList /></AppLayout>}
        />
        <Route
          path="/balance"
          element={<AppLayout><Balance /></AppLayout>}
        />
        <Route
          path="/calendar"
          element={<AppLayout><CustomCalendar /></AppLayout>}
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    <Toaster position="top-right" />
    </>
  );
};

export default App;
