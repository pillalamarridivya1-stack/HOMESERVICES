import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { BookingFormPanel } from '../components/BookingFormPanel';

export const BookingPage: React.FC = () => {
  const { selectedServiceIdForBooking, navigate } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <button
          type="button"
          onClick={() => navigate('services')}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </button>

        <BookingFormPanel
          initialServiceId={selectedServiceIdForBooking}
          onSuccessRedirect={() => navigate('user-dashboard')}
        />
      </main>
      <Footer />
    </div>
  );
};
