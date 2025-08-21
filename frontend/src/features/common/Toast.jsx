import React from 'react';

export const Toast = ({ message, type = 'info' }) => {
  if (!message) return null;
  const color = type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700';
  return (
    <div className="toaster">
      <div className={`px-4 py-2 rounded shadow ${color} border`}>
        {message}
      </div>
    </div>
  );
};
