import React, { useState } from 'react';
import { createLeave } from './leaveApi';

const LeaveForm = () => {
    const [form, setForm] = useState({ leaveType: 'vacation', startDate: '', endDate: '', reason: '' });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setMsg('');
        setLoading(true);
        try {
            await createLeave(form);
            setMsg('Leave request submitted.');
            setForm({ leaveType: 'vacation', startDate: '', endDate: '', reason: '' });
        } catch (err) {
            setMsg(err.response?.data?.message || 'Failed to submit leave');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
                {msg && <div className="mb-4 text-lg text-teal-600">{msg}</div>}
                <form onSubmit={submit} className="space-y-4">
                    <select name="leaveType" value={form.leaveType} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                        <option value="vacation">Vacation</option>
                        <option value="sick">Sick Leave</option>
                        <option value="other">Other</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="border px-3 py-2 rounded" />
                        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="border px-3 py-2 rounded" />
                    </div>

                    <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Reason" className="w-full border px-3 py-2 rounded" rows="4" required />

                    <button type="submit" disabled={loading} className="btn btn-primary">
                        {loading ? <div className="spinner" /> : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeaveForm;
