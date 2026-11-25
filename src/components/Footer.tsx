import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="mt-auto bg-[#0F294A] text-slate-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div>
          <span className="font-bold text-white">Home Service Booking</span> · Reliable Home
          Services
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="hover:text-white cursor-pointer"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate('services')}
            className="hover:text-white cursor-pointer"
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => navigate('login')}
            className="hover:text-white cursor-pointer"
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => navigate('admin-login')}
            className="hover:text-white cursor-pointer"
          >
            Admin Login
          </button>
          <button
            type="button"
            onClick={() => navigate('server-login')}
            className="hover:text-white cursor-pointer"
          >
            Server Login
          </button>
        </div>
      </div>
    </footer>
  );
};
