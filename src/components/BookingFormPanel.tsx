import React, { useEffect, useState } from 'react';
import { Banknote, Calendar, CheckCircle2, Clock, MapPin, Phone, QrCode, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TIME_SLOTS } from '../data/seedData';
import { PaymentMethod } from '../types';

interface BookingFormPanelProps {
  initialServiceId?: string;
  onSuccessRedirect?: () => void;
}

export const BookingFormPanel: React.FC<BookingFormPanelProps> = ({
  initialServiceId,
  onSuccessRedirect,
}) => {
  const { services, session, users, createBooking, navigate } = useApp();
  const currentUser = users.find((u) => u.id === session?.id);

  const [serviceId, setServiceId] = useState(initialServiceId || services[0]?.id || 'SVC-01');
  const [customerName, setCustomerName] = useState(currentUser?.name || session?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || session?.phone || '');
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [qrPaid, setQrPaid] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const selectedService = services.find((s) => s.id === serviceId) || services[0];

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setQrPaid(false);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bookingDate) {
      setError('Please select a booking date.');
      return;
    }
    if (!timeSlot) {
      setError('Please select a preferred time slot.');
      return;
    }
    if (paymentMethod === 'Scan to Pay' && !qrPaid) {
      setError('Please click "Confirm Payment" in the Scan to Pay box before submitting.');
      return;
    }

    const res = createBooking({
      serviceId: selectedService.id,
      customerName,
      customerPhone,
      bookingDate,
      timeSlot,
      address,
      paymentMethod,
    });

    if (!res.ok) {
      setError(res.message);
      return;
    }

    setConfirmedBookingId(res.bookingId || null);
  };

  if (confirmedBookingId) {
    return (
      <div className="bg-white rounded-xl border border-emerald-200 p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#0F294A]">Booking Confirmed!</h2>
        <p className="text-sm text-slate-600">
          Your request for <span className="font-semibold text-slate-900">{selectedService.name}</span>{' '}
          has been saved.
        </p>
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm space-y-1.5 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Booking ID:</span>
            <span className="font-mono font-bold text-blue-700">{confirmedBookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Date & Slot:</span>
            <span className="font-semibold text-slate-900">
              {bookingDate} · {timeSlot}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-semibold text-slate-900">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Status:</span>
            <span
              className={`font-semibold ${
                paymentMethod === 'Scan to Pay' ? 'text-emerald-700' : 'text-amber-700'
              }`}
            >
              {paymentMethod === 'Scan to Pay' ? 'Paid' : 'Pending (Pay Cash)'}
            </span>
          </div>
        </div>
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setConfirmedBookingId(null);
              setQrPaid(false);
              setBookingDate('');
              setTimeSlot('');
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            Book Another Service
          </button>
          <button
            type="button"
            onClick={() => {
              if (onSuccessRedirect) {
                onSuccessRedirect();
              } else {
                navigate('user-dashboard');
              }
            }}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 max-w-3xl">
      <div className="pb-4 border-b border-slate-100 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0F294A]">Book a Home Service</h2>
          <p className="text-sm text-slate-500">
            Complete your details, choose date & time slot, and pick a payment option.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 block">Selected Price</span>
          <span className="text-2xl font-bold text-blue-700 tabular-nums">
            ₹{selectedService.price}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Selected Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{s.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Price
            </label>
            <input
              type="text"
              readOnly
              value={`₹${selectedService.price}`}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold text-[#0F294A] tabular-nums"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Customer Name
            </label>
            <div className="relative">
              <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Booking Date
            </label>
            <div className="relative">
              <Calendar className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Preferred Time Slot
            </label>
            <div className="relative">
              <Clock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <select
                required
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
              >
                <option value="">-- Select a Time Slot --</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Complete Address
          </label>
          <div className="relative">
            <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={2}
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat No, Street, Area, City"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Two Payment Options: Cash or Scan to Pay */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('Cash')}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                paymentMethod === 'Cash'
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <Banknote className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-semibold text-sm">Cash Payment</div>
                <div className="text-xs text-slate-500">
                  Pay after service (Status starts as Pending)
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePaymentMethodChange('Scan to Pay')}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                paymentMethod === 'Scan to Pay'
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <QrCode className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <div className="font-semibold text-sm">Scan to Pay</div>
                <div className="text-xs text-slate-500">
                  Instant QR payment simulation
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === 'Scan to Pay' && (
            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-5 flex flex-col sm:flex-row items-center gap-6">
              {/* Sample Demo QR Code SVG */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shrink-0">
                <svg
                  width="120"
                  height="120"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Sample Payment QR Code"
                >
                  <rect width="120" height="120" fill="#FFFFFF" />
                  <rect x="10" y="10" width="32" height="32" stroke="#0F294A" strokeWidth="6" />
                  <rect x="20" y="20" width="12" height="12" fill="#0F294A" />
                  <rect x="78" y="10" width="32" height="32" stroke="#0F294A" strokeWidth="6" />
                  <rect x="88" y="20" width="12" height="12" fill="#0F294A" />
                  <rect x="10" y="78" width="32" height="32" stroke="#0F294A" strokeWidth="6" />
                  <rect x="20" y="88" width="12" height="12" fill="#0F294A" />
                  <rect x="52" y="14" width="8" height="8" fill="#0F294A" />
                  <rect x="52" y="30" width="14" height="8" fill="#0F294A" />
                  <rect x="14" y="52" width="12" height="8" fill="#0F294A" />
                  <rect x="34" y="52" width="18" height="8" fill="#0F294A" />
                  <rect x="60" y="52" width="14" height="14" fill="#1D4ED8" />
                  <rect x="84" y="52" width="24" height="8" fill="#0F294A" />
                  <rect x="52" y="76" width="10" height="16" fill="#0F294A" />
                  <rect x="72" y="76" width="14" height="10" fill="#0F294A" />
                  <rect x="94" y="76" width="14" height="14" fill="#0F294A" />
                  <rect x="52" y="100" width="20" height="10" fill="#0F294A" />
                  <rect x="82" y="98" width="26" height="12" fill="#0F294A" />
                </svg>
              </div>

              <div className="space-y-2.5 text-center sm:text-left">
                <div className="text-sm font-bold text-[#0F294A]">
                  Scan QR Code to Pay{' '}
                  <span className="text-blue-700 tabular-nums">₹{selectedService.price}</span>
                </div>
                <p className="text-xs text-slate-600">
                  Demo payment simulation: click the confirmation button below after scanning.
                </p>
                {qrPaid ? (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100 border border-emerald-200 px-3.5 py-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Payment Confirmed (₹{selectedService.price})
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQrPaid(true);
                      setError('');
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Confirm Payment (₹{selectedService.price})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};
