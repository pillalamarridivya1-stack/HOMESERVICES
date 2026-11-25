import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { session, navigate, currentView } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handlePrimaryAction = () => {
    if (session?.role === 'admin') {
      navigate('admin-dashboard');
    } else if (session?.role === 'server') {
      navigate('server-dashboard');
    } else if (session?.role === 'user') {
      navigate('user-dashboard');
    } else {
      navigate('services');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="text-xl font-bold tracking-tight text-[#0F294A] whitespace-nowrap shrink-0 cursor-pointer"
        >
          Home Service Booking
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => navigate('home')}
            className={`hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'home' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigate('services')}
            className={`hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'services' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Services
          </button>
          <button
            type="button"
            onClick={() => navigate('login')}
            className={`hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'login' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate('admin-login')}
            className={`hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'admin-login' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => navigate('server-login')}
            className={`hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentView === 'server-login' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Server Login
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {session ? 'My Dashboard' : 'Book Service'}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          {[
            { label: 'Home', view: 'home' as const },
            { label: 'Services', view: 'services' as const },
            { label: 'User Login', view: 'login' as const },
            { label: 'User Signup', view: 'signup' as const },
            { label: 'Admin Login', view: 'admin-login' as const },
            { label: 'Server Login', view: 'server-login' as const },
          ].map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => {
                navigate(item.view);
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
