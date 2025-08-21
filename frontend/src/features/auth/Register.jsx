import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../common/apiClient';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiClient.post('/auth/register', form);
      // tiny delay to show spinner
      setTimeout(() => navigate('/login', { replace: true }), 700);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-md w-full card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Join your company’s leave system</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" required className="w-full border px-3 py-2 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" required className="w-full border px-3 py-2 rounded-lg" />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border px-3 py-2 rounded-lg">
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <div className="spinner" /> : 'Register'}
          </button>

          <div className="text-center text-sm text-gray-600 mt-2">
            Already have an account? <Link to="/login" className="text-teal-600 font-medium">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
