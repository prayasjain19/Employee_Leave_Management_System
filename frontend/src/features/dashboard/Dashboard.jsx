import React, { useEffect, useState, useContext } from 'react';
import { fetchStats } from './dashboardApi';
import { AuthContext } from '../auth/authContext';
import apiClient from '../common/apiClient';

const StatCard = ({ title, value }) => (
    <div className="p-4 card">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [pendingLeaves, setPendingLeaves] = useState([]);

    useEffect(() => {
        if (user?.role?.toLowerCase() === 'manager') {
            fetchStats()
                .then(setStats)
                .catch(console.error);

            // also fetch recent pending
            apiClient.get('/leaves/pending')
                .then(res => setPendingLeaves(res.data))
                .catch(() => { });
        } else {
            // for employees fetch personal summary
            apiClient.get('/leaves/me')
                .then(res => {
                    const leaves = res.data;
                    setStats({
                        pending: leaves.filter(l => l.status === 'Pending').length,
                        approved: leaves.filter(l => l.status === 'Approved').length,
                        rejected: leaves.filter(l => l.status === 'Rejected').length,
                    });
                })
                .catch(() => { });
        }
    }, [user]);


    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard title="Pending Leaves" value={stats?.pending ?? '—'} />
                <StatCard title="Approved Leaves" value={stats?.approved ?? '—'} />
                <StatCard title="Rejected Leaves" value={stats?.rejected ?? '—'} />
            </div>

            <div className="card p-4">
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                {user?.role?.toLowerCase() === 'manager' ? (
                    pendingLeaves.length ? (
                        pendingLeaves.map(l => (
                            <div key={l._id} className="p-3 border-b last:border-b-0">
                                <div className="flex justify-between">
                                    <div>
                                        <div className="font-medium">{l.employee?.name || 'Employee'}</div>
                                        <div className="text-sm text-gray-500">{l.leaveType} • {new Date(l.startDate).toDateString()} - {new Date(l.endDate).toDateString()}</div>
                                    </div>
                                    <div className="text-sm text-gray-500">Status: {l.status}</div>
                                </div>
                            </div>
                        ))
                    ) : (<div className="text-sm text-gray-500">No pending requests</div>)
                ) : (
                    <div className="text-sm text-gray-500">Welcome to your dashboard. Use the left menu to apply for leaves or view balances.</div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
