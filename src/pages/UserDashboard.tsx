import React, { useState } from 'react';
import {
  CalendarCheck,
  CreditCard,
  Grid,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Search,
  Star,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ServiceCard } from '../components/ServiceCard';
import { BookingFormPanel } from '../components/BookingFormPanel';

type UserTab = 'overview' | 'browse' | 'book' | 'bookings' | 'payments' | 'reviews';

export const UserDashboard: React.FC = () => {
  const {
    session,
    bookings,
    payments,
    reviews,
    services,
    selectedServiceIdForBooking,
    setSelectedServiceIdForBooking,
    navigate,
    logout,
    cancelBooking,
    submitReview,
  } = useApp();

  const [activeTab, setActiveTab] = useState<UserTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Browse Services filter
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceCategory, setServiceCategory] = useState('All');

  // Review Form state
  const [reviewBookingId, setReviewBookingId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewNotice, setReviewNotice] = useState<{ ok: boolean; message: string } | null>(null);

  const myBookings = bookings.filter((b) => b.userId === session?.id);
  const myPayments = payments.filter((p) => p.userId === session?.id);
  const myReviews = reviews.filter((r) => r.userId === session?.id);

  const completedWithoutReview = myBookings.filter(
    (b) => b.status === 'Completed' && !reviews.some((r) => r.bookingId === b.bookingId)
  );

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Appliance', 'Carpentry'];
  const filteredServices = services.filter((s) => {
    const matchesCat = serviceCategory === 'All' || s.category === serviceCategory;
    const q = serviceSearch.trim().toLowerCase();
    const matchesQ =
      !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  const handleBookFromDashboard = (serviceId: string) => {
    setSelectedServiceIdForBooking(serviceId);
    setActiveTab('book');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBookingId) {
      setReviewNotice({ ok: false, message: 'Please select a completed booking.' });
      return;
    }
    const res = submitReview({ bookingId: reviewBookingId, rating, comment });
    setReviewNotice(res);
    if (res.ok) {
      setComment('');
      setReviewBookingId('');
    }
  };

  const navItems: { id: UserTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'browse', label: 'Browse Services', icon: <Grid className="h-4 w-4" /> },
    { id: 'book', label: 'Book a Service', icon: <PlusCircle className="h-4 w-4" /> },
    { id: 'bookings', label: 'My Bookings', icon: <CalendarCheck className="h-4 w-4" /> },
    { id: 'payments', label: 'Payment Details', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'reviews', label: 'My Reviews', icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Blue Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0F294A] text-white flex flex-col transition-transform lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-blue-900/60">
          <span className="text-lg font-bold tracking-tight">HomeCare User</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-blue-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-blue-900/60">
          <div className="text-xs text-blue-300">Welcome</div>
          <div className="font-semibold text-sm truncate mt-0.5">{session?.name}</div>
          <div className="text-xs text-blue-200 truncate">{session?.email}</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-100 hover:bg-blue-900/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-blue-900/60 space-y-1">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-900/60 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home Page</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-200 hover:bg-rose-950/40 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold text-[#0F294A]">
              {navItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('book')}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            + Book a Service
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* 1. Dashboard Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm text-slate-500 font-medium">Total Bookings</div>
                  <div className="text-3xl font-bold text-[#0F294A] mt-2 tabular-nums">
                    {myBookings.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm text-slate-500 font-medium">Pending Bookings</div>
                  <div className="text-3xl font-bold text-amber-600 mt-2 tabular-nums">
                    {myBookings.filter((b) => b.status === 'Pending').length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm text-slate-500 font-medium">Completed Services</div>
                  <div className="text-3xl font-bold text-emerald-600 mt-2 tabular-nums">
                    {myBookings.filter((b) => b.status === 'Completed').length}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Recent Bookings</h2>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bookings')}
                    className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All Bookings
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Booking ID</th>
                        <th className="py-3 px-4 font-semibold">Service Name</th>
                        <th className="py-3 px-4 font-semibold">Date & Time Slot</th>
                        <th className="py-3 px-4 font-semibold">Price</th>
                        <th className="py-3 px-4 font-semibold">Payment</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myBookings.slice(0, 5).map((b) => (
                        <tr key={b.bookingId} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                            {b.bookingId}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900">{b.serviceName}</td>
                          <td className="py-3.5 px-4 text-slate-600 tabular-nums">
                            {b.bookingDate} · {b.timeSlot}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                            ₹{b.servicePrice}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-xs text-slate-600 mb-1">{b.paymentMethod}</div>
                            <StatusBadge status={b.paymentStatus} />
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))}
                      {myBookings.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-500">
                            No bookings yet. Click &ldquo;+ Book a Service&rdquo; to schedule one.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* 2. Browse Services */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search services..."
                    className="w-full sm:w-64 rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setServiceCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        serviceCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((s) => (
                  <ServiceCard key={s.id} service={s} onBook={handleBookFromDashboard} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Book a Service */}
          {activeTab === 'book' && (
            <BookingFormPanel
              initialServiceId={selectedServiceIdForBooking}
              onSuccessRedirect={() => setActiveTab('bookings')}
            />
          )}

          {/* 4. My Bookings */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-bold text-slate-900">My Bookings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Booking ID</th>
                      <th className="py-3 px-4 font-semibold">Service Name</th>
                      <th className="py-3 px-4 font-semibold">Date & Time Slot</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Payment Method</th>
                      <th className="py-3 px-4 font-semibold">Payment Status</th>
                      <th className="py-3 px-4 font-semibold">Assigned Server</th>
                      <th className="py-3 px-4 font-semibold">Booking Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myBookings.map((b) => {
                      const alreadyReviewed = reviews.some((r) => r.bookingId === b.bookingId);
                      return (
                        <tr key={b.bookingId} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            {b.bookingId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-900">{b.serviceName}</div>
                            <div className="text-xs text-slate-500 max-w-xs truncate">
                              {b.address}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                            <div>{b.bookingDate}</div>
                            <div className="text-xs text-slate-500">{b.timeSlot}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                            ₹{b.servicePrice}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{b.paymentMethod}</td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.paymentStatus} />
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            {b.assignedServerId ? (
                              <div>
                                <div className="font-medium text-xs">{b.assignedServerName}</div>
                                <div className="font-mono text-xs text-blue-700">
                                  {b.assignedServerId}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={b.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {(b.status === 'Pending' || b.status === 'Assigned') && (
                              <button
                                type="button"
                                onClick={() => cancelBooking(b.bookingId)}
                                className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                              >
                                Cancel Booking
                              </button>
                            )}
                            {b.status === 'Completed' && !alreadyReviewed && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewBookingId(b.bookingId);
                                  setActiveTab('reviews');
                                }}
                                className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                              >
                                Rate Service
                              </button>
                            )}
                            {b.status === 'Completed' && alreadyReviewed && (
                              <span className="text-xs text-emerald-700 font-medium">Reviewed</span>
                            )}
                            {b.status === 'Cancelled' && (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {myBookings.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500">
                          You have no bookings yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Payment Details */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="font-bold text-slate-900">Payment Details</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Payment ID</th>
                      <th className="py-3 px-4 font-semibold">Booking ID</th>
                      <th className="py-3 px-4 font-semibold">Service</th>
                      <th className="py-3 px-4 font-semibold">Method</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPayments.map((p) => (
                      <tr key={p.paymentId} className="hover:bg-slate-50/70">
                        <td className="py-3.5 px-4 font-mono text-slate-900">{p.paymentId}</td>
                        <td className="py-3.5 px-4 font-mono text-blue-700">{p.bookingId}</td>
                        <td className="py-3.5 px-4 text-slate-900">{p.serviceName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{p.method}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                          ₹{p.amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 tabular-nums">{p.date}</td>
                      </tr>
                    ))}
                    {myPayments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No payment records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. My Reviews */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1">Submit Rating & Feedback</h2>
                <p className="text-sm text-slate-500 mb-5">
                  Feedback can be submitted only for Completed bookings (one review per booking).
                </p>

                {reviewNotice && (
                  <div
                    className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
                      reviewNotice.ok
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {reviewNotice.message}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Completed Booking
                    </label>
                    <select
                      value={reviewBookingId}
                      onChange={(e) => setReviewBookingId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">-- Select a Completed Booking --</option>
                      {completedWithoutReview.map((b) => (
                        <option key={b.bookingId} value={b.bookingId}>
                          {b.bookingId} — {b.serviceName} ({b.bookingDate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Star Rating (1 to 5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-amber-400 cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Comments
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write about your experience with the service..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">My Submitted Reviews</h2>
                <div className="space-y-3">
                  {myReviews.map((rev) => (
                    <div
                      key={rev.reviewId}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-slate-900">
                          {rev.serviceName}
                        </span>
                        <span className="text-xs font-semibold text-amber-600">
                          {rev.rating}/5 ★
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{rev.comment}</p>
                      <div className="text-xs text-slate-400 mt-2">
                        {rev.bookingId} · {rev.date}
                      </div>
                    </div>
                  ))}
                  {myReviews.length === 0 && (
                    <p className="text-sm text-slate-500">
                      You have not submitted any reviews yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
