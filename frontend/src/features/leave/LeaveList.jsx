import React, { useEffect, useState, useContext } from 'react';
import { fetchMyLeaves, fetchPendingLeaves, decideLeave } from './leaveApi';
import { AuthContext } from '../auth/authContext';
import toast from 'react-hot-toast';

const LeaveCard = ({ l, onDecision, isManager }) => (
    <div className="p-4 border-b last:border-b-0">
        <div className="flex justify-between items-start">
            <div>
                <div className="font-semibold">{isManager ? l.employee?.name : l.leaveType}</div>
                <div className="text-xs text-gray-500">{new Date(l.startDate).toDateString()} - {new Date(l.endDate).toDateString()}</div>
                <div className="mt-2 text-sm">{l.reason}</div>
            </div>
            <div className="text-right">
                <div className={`text-sm ${l.status === 'Approved' ? 'text-green-600' : l.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {l.status}
                </div>
                {isManager && l.status === 'Pending' && (
                    <div className="mt-2 space-x-2">
                        <button
                            onClick={() => onDecision(l._id, 'Approved')}
                            className="px-3 py-1 bg-green-500 text-white rounded"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => onDecision(l._id, 'Rejected')}
                            className="px-3 py-1 bg-red-500 text-white rounded"
                        >
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const LeaveList = () => {
    const { user } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const data = user?.role?.toLowerCase() === 'manager'
                ? await fetchPendingLeaves()
                : await fetchMyLeaves();
            setLeaves(data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load leaves");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [user]);

    const handleDecision = async (id, decision) => {
        try {
            await decideLeave(id, { decision });
            toast.success(`Leave ${decision}`);
            load();
        } catch (err) {
            console.error("Decision error:", err.response?.data || err.message);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="card p-4">
                <h2 className="text-lg font-semibold mb-3">
                    {user?.role?.toLowerCase() === 'manager' ? 'Pending Requests' : 'My Leaves'}
                </h2>
                {loading ? (
                    <div className="text-center py-6"><div className="spinner" /></div>
                ) : (
                    leaves.length ? (
                        leaves.map(l => (
                            <LeaveCard
                                key={l._id}
                                l={l}
                                onDecision={handleDecision}
                                isManager={user?.role?.toLowerCase() === 'manager'}
                            />
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 p-4">No leaves found.</div>
                    )
                )}
            </div>
        </div>
    );
};

export default LeaveList;
