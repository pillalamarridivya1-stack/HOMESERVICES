import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone, Search, ShieldCheck, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ServiceCard } from '../components/ServiceCard';

export const HomePage: React.FC = () => {
  const { services, reviews, navigate, startBookingForService } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const categories = ['All', 'Plumbing', 'Electrical', 'Cleaning', 'Appliance', 'Carpentry'];

  const filteredServices = services.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-blue-700 mb-3">
                Trusted Home Maintenance · Easy Online Booking
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F294A] leading-tight mb-5"
                style={{ textWrap: 'balance' }}
              >
                Reliable Home Services Booked in Minutes
              </h1>
              <p className="text-base text-slate-600 leading-relaxed mb-8 max-w-xl">
                Book certified professionals for plumbing, electrical repairs, home cleaning, AC
                servicing, carpentry, and appliance repair with transparent prices and flexible time
                slots.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate('services')}
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Browse All Services
                </button>
                <button
                  type="button"
                  onClick={() => navigate('signup')}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Create Free Account
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src="/src/assets/images/hero_home_services_1795627938822.jpg"
                  alt="Technician inspecting home climate control"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F294A]">Popular Services</h2>
              <p className="text-sm text-slate-600 mt-1">
                Search or filter by category and click Book Now to schedule a slot.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search plumbing, AC, cleaning..."
                  className="w-full sm:w-60 rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={startBookingForService}
              />
            ))}
            {filteredServices.length === 0 && (
              <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                No services matched &ldquo;{searchTerm}&rdquo;. Try clearing your search filter.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Us & Why Choose Us */}
      <section className="py-14 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white rounded-xl border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-[#0F294A] mb-3">About Us</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              HomeCare is a simple, dependable home maintenance booking platform designed to connect
              homeowners with essential household services—from leaky pipes and electrical wiring
              checks to full home deep cleaning and appliance servicing.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every service carries upfront fixed pricing, easy online booking with preferred time
              slots, and transparent tracking from Pending to Completed.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-7">
            <h2 className="text-2xl font-bold text-[#0F294A] mb-4">Why Choose Us</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Transparent Pricing:</strong> Clear service
                  rates before you confirm your booking.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Flexible Time Slots:</strong> Choose a date and
                  two-hour arrival window that fits your day.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Cash or Scan to Pay:</strong> Pay in cash after
                  completion or confirm instantly via QR code.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Verified Reviews:</strong> Real ratings and
                  feedback submitted only on completed bookings.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0F294A] mb-6">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.reviewId}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-slate-900">{rev.serviceName}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      {rev.rating}.0
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{rev.comment}</p>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-medium text-slate-800">{rev.customerName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0F294A]">Contact Us</h2>
            <p className="text-sm text-slate-600 max-w-md">
              Need help with a booking or have questions about our home services? Reach out to our
              support desk.
            </p>
            <div className="space-y-3 text-sm text-slate-700 pt-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+91 80 4123 9800</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@homeservices.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>MG Road, Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {contactSent ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                Thank you for reaching out! Our team has received your message.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
