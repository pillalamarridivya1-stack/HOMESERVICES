import React, { useState } from 'react';
import {
  ArrowLeft,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  UserPlus,
  Wrench,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { loginUser, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = loginUser(email, password);
    if (!res.ok) setError(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home Page
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">User Login</h1>
              <p className="text-sm text-slate-500">Sign in to book and manage home services</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya@example.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Login
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            New to Home Service Booking?{' '}
            <button
              type="button"
              onClick={() => navigate('signup')}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-3.5 text-xs text-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-blue-900">Demo User Account</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('ananya@example.com');
                  setPassword('user123');
                }}
                className="text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p className="font-mono text-slate-600">ananya@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SignupPage: React.FC = () => {
  const { registerUser, navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = registerUser({ name, email, phone, password, address });
    if (!res.ok) setError(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home Page
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">User Signup</h1>
              <p className="text-sm text-slate-500">Create your customer account</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Priya Nair"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
              <div className="relative">
                <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 202, Lakeview Apartments"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('login')}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Login here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(email, password);
    if (!res.ok) setError(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home Page
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-lg bg-[#0F294A] flex items-center justify-center text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Login</h1>
              <p className="text-sm text-slate-500">
                Manage bookings, servers & task assignments
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@homeservices.com"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#0F294A] py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-900 transition-colors cursor-pointer"
            >
              Login to Admin Dashboard
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-3.5 text-xs text-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-blue-900">Demo Admin Credentials</span>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@homeservices.com');
                  setPassword('Admin123');
                }}
                className="text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p className="font-mono text-slate-600">admin@homeservices.com / Admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ServerLoginPage: React.FC = () => {
  const { loginServer, navigate, servers } = useApp();
  const [serverId, setServerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = loginServer(serverId, password);
    if (!res.ok) setError(res.message);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home Page
        </button>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-11 w-11 rounded-lg bg-blue-700 flex items-center justify-center text-white">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Server Login</h1>
              <p className="text-sm text-slate-500">
                Sign in with your registered Server ID to view your tasks
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Server ID</label>
              <div className="relative">
                <KeyRound className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="e.g. SRV-101"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm font-mono uppercase focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter server password"
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Login to Server Dashboard
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-blue-50 border border-blue-100 p-3.5 text-xs text-slate-700 space-y-1.5">
            <div className="font-semibold text-blue-900">
              Registered Servers ({servers.length})
            </div>
            {servers.slice(0, 3).map((srv) => (
              <div key={srv.serverId} className="flex items-center justify-between">
                <span className="font-mono text-slate-700">
                  {srv.serverId} — {srv.name}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setServerId(srv.serverId);
                    setPassword(srv.password);
                  }}
                  className="text-blue-700 font-semibold hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
