import React, { useEffect, useState, useContext } from 'react';
import { fetchMyBalance } from './balanceApi';
import { AuthContext } from '../auth/authContext';

const Balance = () => {
  const { user } = useContext(AuthContext);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    fetchMyBalance().then(setBalance).catch(console.error);
  }, []);

  if (!balance) return <div className="p-6 text-center"><div className="spinner" /></div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm text-gray-500">Vacation Days</h3>
          <div className="text-3xl font-bold">{balance.vacationDays}</div>
        </div>
        <div>
          <h3 className="text-sm text-gray-500">Sick Days</h3>
          <div className="text-3xl font-bold">{balance.sickDays}</div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
