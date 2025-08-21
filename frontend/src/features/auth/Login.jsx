import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../common/apiClient';
import { AuthContext } from './authContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', form);
      login(data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 to-white">
      <div className="max-w-md w-full card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Employee Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your leaves</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" required className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-300"/>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" required className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-teal-300"/>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <div className="spinner" /> : 'Sign in'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account? <Link to="/register" className="text-teal-600 font-medium">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
