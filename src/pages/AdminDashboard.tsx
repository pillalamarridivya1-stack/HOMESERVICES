import React, { useMemo, useState } from 'react';
import {
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Edit3,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Server,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ServerAccount } from '../types';

type AdminSection =
  | 'overview'
  | 'all-bookings'
  | 'pending-bookings'
  | 'assign-tasks'
  | 'completed-bookings'
  | 'cancelled-bookings'
  | 'manage-servers'
  | 'payment-records'
  | 'customer-feedback';

type TaskFilterTab = 'unassigned' | 'all-assigned' | 'server-wise' | 'pending' | 'completed';

export const AdminDashboard: React.FC = () => {
  const {
    session,
    users,
    servers,
    services,
    bookings,
    payments,
    reviews,
    taskAssignments,
    navigate,
    logout,
    markBookingCompleted,
    cancelBooking,
    markCashPaymentPaid,
    addServer,
    updateServer,
    deleteServer,
    assignTask,
    reassignTask,
  } = useApp();

  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<{ ok: boolean; message: string } | null>(null);

  // Assign Task Modal / Form state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignMode, setAssignMode] = useState<'assign' | 'reassign'>('assign');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [selectedServerId, setSelectedServerId] = useState('');
  const [assignNotice, setAssignNotice] = useState<{ ok: boolean; message: string } | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilterTab>('unassigned');
  const [serverWiseFilterId, setServerWiseFilterId] = useState<string>('ALL');

  // Manage Servers Form state
  const [newServerName, setNewServerName] = useState('');
  const [newServerId, setNewServerId] = useState('');
  const [newServerPhone, setNewServerPhone] = useState('');
  const [newServerPassword, setNewServerPassword] = useState('');
  const [newServerSpecialty, setNewServerSpecialty] = useState('General Home Services');
  const [serverNotice, setServerNotice] = useState<{ ok: boolean; message: string } | null>(null);
  const [editingServer, setEditingServer] = useState<ServerAccount | null>(null);

  const sidebarItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'all-bookings', label: 'All Bookings', icon: <ListChecks className="h-4 w-4" /> },
    { id: 'pending-bookings', label: 'Pending Bookings', icon: <CalendarClock className="h-4 w-4" /> },
    // Placed directly above Completed Bookings
    { id: 'assign-tasks', label: 'Assign Tasks', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'completed-bookings', label: 'Completed Bookings', icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: 'cancelled-bookings', label: 'Cancelled Bookings', icon: <Ban className="h-4 w-4" /> },
    { id: 'manage-servers', label: 'Manage Servers', icon: <Server className="h-4 w-4" /> },
    { id: 'payment-records', label: 'Payment Records', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'customer-feedback', label: 'Customer Feedback', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const unassignedBookings = useMemo(
    () =>
      bookings.filter(
        (b) => !b.assignedServerId && b.status !== 'Completed' && b.status !== 'Cancelled'
      ),
    [bookings]
  );

  const pendingList = useMemo(
    () =>
      bookings.filter(
        (b) => b.status === 'Pending' || b.status === 'Assigned' || b.status === 'In Progress'
      ),
    [bookings]
  );

  const completedList = useMemo(
    () => bookings.filter((b) => b.status === 'Completed'),
    [bookings]
  );

  const cancelledList = useMemo(
    () => bookings.filter((b) => b.status === 'Cancelled'),
    [bookings]
  );

  const activeServers = useMemo(
    () => servers.filter((s) => s.status === 'Active'),
    [servers]
  );

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === 'Paid')
        .reduce((sum, item) => sum + item.amount, 0),
    [payments]
  );

  const serviceWiseSummary = useMemo(() => {
    return services.map((svc) => {
      const svcBookings = bookings.filter((b) => b.serviceName === svc.name);
      return {
        serviceName: svc.name,
        total: svcBookings.length,
        pending: svcBookings.filter(
          (b) => b.status === 'Pending' || b.status === 'Assigned' || b.status === 'In Progress'
        ).length,
        completed: svcBookings.filter((b) => b.status === 'Completed').length,
        cancelled: svcBookings.filter((b) => b.status === 'Cancelled').length,
        revenue: svcBookings
          .filter((b) => b.paymentStatus === 'Paid')
          .reduce((acc, cur) => acc + cur.servicePrice, 0),
      };
    });
  }, [services, bookings]);

  const selectedBookingDetails = useMemo(
    () => bookings.find((b) => b.bookingId === selectedBookingId) || null,
    [bookings, selectedBookingId]
  );

  const openAssignPopup = (bookingId?: string, mode: 'assign' | 'reassign' = 'assign') => {
    setAssignMode(mode);
    setAssignNotice(null);
    setSelectedServerId('');
    if (bookingId) {
      setSelectedBookingId(bookingId);
    } else {
      setSelectedBookingId(unassignedBookings[0]?.bookingId || '');
    }
    setAssignModalOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !selectedServerId) {
      setAssignNotice({
        ok: false,
        message: 'Please select both a Booking ID and a Server ID.',
      });
      return;
    }

    const res =
      assignMode === 'reassign'
        ? reassignTask(selectedBookingId, selectedServerId)
        : assignTask(selectedBookingId, selectedServerId);

    setAssignNotice(res);
    if (res.ok) {
      setActionNotice(res);
      setSelectedServerId('');
      if (assignMode === 'assign') {
        const remaining = unassignedBookings.filter((b) => b.bookingId !== selectedBookingId);
        setSelectedBookingId(remaining[0]?.bookingId || '');
      }
    }
  };

  const handleAddServer = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addServer({
      serverId: newServerId,
      name: newServerName,
      phone: newServerPhone,
      password: newServerPassword,
      specialty: newServerSpecialty,
    });
    setServerNotice(res);
    if (res.ok) {
      setNewServerName('');
      setNewServerId('');
      setNewServerPhone('');
      setNewServerPassword('');
      setNewServerSpecialty('General Home Services');
    }
  };

  const handleSaveEditServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServer) return;
    const res = updateServer(editingServer.serverId, {
      name: editingServer.name,
      phone: editingServer.phone,
      password: editingServer.password,
      specialty: editingServer.specialty,
      status: editingServer.status,
    });
    setServerNotice(res);
    if (res.ok) setEditingServer(null);
  };

  const filterBySearch = <
    T extends { bookingId?: string; customerName?: string; serviceName?: string }
  >(
    list: T[]
  ) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (item) =>
        item.bookingId?.toLowerCase().includes(q) ||
        item.customerName?.toLowerCase().includes(q) ||
        item.serviceName?.toLowerCase().includes(q)
    );
  };

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'pending') {
      return taskAssignments.filter((t) => t.taskStatus !== 'Completed');
    }
    if (taskFilter === 'completed') {
      return taskAssignments.filter((t) => t.taskStatus === 'Completed');
    }
    if (taskFilter === 'server-wise') {
      if (serverWiseFilterId === 'ALL') return taskAssignments;
      return taskAssignments.filter((t) => t.serverId === serverWiseFilterId);
    }
    return taskAssignments;
  }, [taskAssignments, taskFilter, serverWiseFilterId]);

  const renderAssignTaskBannerBox = () => (
    <div
      onClick={() => openAssignPopup(undefined, 'assign')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') openAssignPopup(undefined, 'assign');
      }}
      className="rounded-xl bg-gradient-to-r from-[#0B2545] to-blue-700 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:from-[#13315C] hover:to-blue-600 transition-all shadow-sm"
    >
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
          <ClipboardList className="h-4 w-4" />
          Assign Task Box
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Assign Task to Registered Server ID
        </h3>
        <p className="text-xs sm:text-sm text-blue-100">
          Click this box to assign an unassigned customer booking to a server.{' '}
          <span className="font-semibold text-white tabular-nums">
            ({unassignedBookings.length} unassigned · {activeServers.length} active servers)
          </span>
        </p>
      </div>
      <div className="shrink-0">
        <span className="inline-flex items-center gap-2 rounded-lg bg-white text-blue-700 px-4 py-2.5 text-sm font-bold shadow-sm hover:bg-blue-50">
          <Plus className="h-4 w-4" />
          Assign Task
        </span>
      </div>
    </div>
  );

  const renderBookingsTable = (rows: typeof bookings, emptyText: string) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-semibold">Booking ID</th>
              <th className="py-3 px-4 font-semibold">Customer & Phone</th>
              <th className="py-3 px-4 font-semibold">Service & Address</th>
              <th className="py-3 px-4 font-semibold">Date & Time</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Payment</th>
              <th className="py-3 px-4 font-semibold">Assigned Server</th>
              <th className="py-3 px-4 font-semibold">Booking Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((b) => (
              <tr key={b.bookingId} className="hover:bg-blue-50/30">
                <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                  {b.bookingId}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900">{b.customerName}</div>
                  <div className="text-xs text-slate-500 tabular-nums">{b.customerPhone}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">{b.serviceName}</div>
                  <div className="text-xs text-slate-500 max-w-xs truncate">{b.address}</div>
                </td>
                <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                  <div>{b.bookingDate}</div>
                  <div className="text-xs text-slate-500">{b.timeSlot}</div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 tabular-nums">
                  ₹{b.servicePrice}
                </td>
                <td className="py-3.5 px-4">
                  <div className="text-xs font-medium text-slate-700 mb-1">{b.paymentMethod}</div>
                  <StatusBadge status={b.paymentStatus} />
                </td>
                <td className="py-3.5 px-4">
                  {b.assignedServerId ? (
                    <div>
                      <div className="font-semibold text-xs text-slate-900">
                        {b.assignedServerName}
                      </div>
                      <div className="font-mono text-xs text-blue-700">{b.assignedServerId}</div>
                    </div>
                  ) : (
                    <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5">
                      Unassigned
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={b.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    {/* Assign Task / Reassign button placed directly above Mark as Completed */}
                    {!b.assignedServerId &&
                      b.status !== 'Completed' &&
                      b.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => openAssignPopup(b.bookingId, 'assign')}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                        >
                          Assign Task
                        </button>
                      )}
                    {b.assignedServerId &&
                      b.status !== 'Completed' &&
                      b.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => openAssignPopup(b.bookingId, 'reassign')}
                          className="rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer whitespace-nowrap"
                        >
                          Reassign Server
                        </button>
                      )}

                    {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <button
                          type="button"
                          onClick={() => setActionNotice(markBookingCompleted(b.bookingId))}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer whitespace-nowrap"
                        >
                          Mark as Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionNotice(cancelBooking(b.bookingId))}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer whitespace-nowrap"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}

                    {b.paymentMethod === 'Cash' &&
                      b.paymentStatus === 'Pending' &&
                      b.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => setActionNotice(markCashPaymentPaid(b.bookingId))}
                          className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
                        >
                          Mark Cash Paid
                        </button>
                      )}

                    {(b.status === 'Completed' || b.status === 'Cancelled') &&
                      !(
                        b.paymentMethod === 'Cash' &&
                        b.paymentStatus === 'Pending' &&
                        b.status !== 'Cancelled'
                      ) && <span className="text-xs text-slate-400">—</span>}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-slate-500">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dark Blue Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B2545] text-white flex flex-col transition-transform lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-blue-900/70">
          <span className="text-lg font-bold tracking-tight text-white">HomeCare Admin</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-blue-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-blue-900/70">
          <div className="text-xs text-blue-300">Administrator</div>
          <div className="font-semibold text-sm text-white truncate mt-0.5">
            {session?.name || 'Admin'}
          </div>
          <div className="text-xs text-blue-300 truncate">{session?.email}</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeSection === item.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-100 hover:bg-blue-900/70 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.id === 'assign-tasks' && unassignedBookings.length > 0 && (
                <span className="rounded bg-amber-400 text-[#0B2545] px-1.5 py-0.5 text-[11px] font-bold tabular-nums">
                  {unassignedBookings.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-blue-900/70 space-y-1">
          <button
            type="button"
            onClick={() => navigate('home')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-blue-100 hover:bg-blue-900/70 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home Page</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-200 hover:bg-rose-950/50 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main White/Slate Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-[#0B2545]">
              {sidebarItems.find((i) => i.id === activeSection)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search booking, customer..."
                className="w-56 rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => openAssignPopup(undefined, 'assign')}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap"
            >
              + Assign Task
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {actionNotice && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center justify-between ${
                actionNotice.ok
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              <span>{actionNotice.message}</span>
              <button
                type="button"
                onClick={() => setActionNotice(null)}
                className="text-xs font-semibold underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 1. Dashboard Overview */}
          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Registered Users
                  </div>
                  <div className="text-3xl font-bold text-[#0B2545] mt-2 tabular-nums">
                    {users.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Total Bookings
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mt-2 tabular-nums">
                    {bookings.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Pending / Active
                  </div>
                  <div className="text-3xl font-bold text-amber-600 mt-2 tabular-nums">
                    {pendingList.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Completed Jobs
                  </div>
                  <div className="text-3xl font-bold text-emerald-600 mt-2 tabular-nums">
                    {completedList.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    Servers / Paid Rev
                  </div>
                  <div className="text-xl font-bold text-[#0B2545] mt-2 tabular-nums">
                    {servers.length} · ₹{totalRevenue}
                  </div>
                </div>
              </div>

              {/* Service-wise Booking Details */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h2 className="font-bold text-[#0B2545]">Service-Wise Booking Details</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Service Name</th>
                        <th className="py-3 px-4 font-semibold">Total Bookings</th>
                        <th className="py-3 px-4 font-semibold">Pending / Active</th>
                        <th className="py-3 px-4 font-semibold">Completed</th>
                        <th className="py-3 px-4 font-semibold">Cancelled</th>
                        <th className="py-3 px-4 font-semibold">Paid Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {serviceWiseSummary.map((row) => (
                        <tr key={row.serviceName} className="hover:bg-slate-50/70">
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {row.serviceName}
                          </td>
                          <td className="py-3 px-4 tabular-nums">{row.total}</td>
                          <td className="py-3 px-4 text-amber-700 font-medium tabular-nums">
                            {row.pending}
                          </td>
                          <td className="py-3 px-4 text-emerald-700 font-medium tabular-nums">
                            {row.completed}
                          </td>
                          <td className="py-3 px-4 text-rose-700 font-medium tabular-nums">
                            {row.cancelled}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#0B2545] tabular-nums">
                            ₹{row.revenue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Assign Task Box directly above Recent Customer Bookings / Complete Task actions */}
              {renderAssignTaskBannerBox()}

              {/* Recent Customer Bookings */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-[#0B2545]">Recent Customer Bookings</h2>
                  <button
                    type="button"
                    onClick={() => setActiveSection('all-bookings')}
                    className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    View All Bookings
                  </button>
                </div>
                {renderBookingsTable(
                  filterBySearch(bookings).slice(0, 6),
                  'No bookings found.'
                )}
              </div>
            </>
          )}

          {/* 2. All Bookings */}
          {activeSection === 'all-bookings' && (
            <div className="space-y-5">
              {renderAssignTaskBannerBox()}
              {renderBookingsTable(filterBySearch(bookings), 'No bookings found.')}
            </div>
          )}

          {/* 3. Pending Bookings */}
          {activeSection === 'pending-bookings' && (
            <div className="space-y-5">
              {renderAssignTaskBannerBox()}
              {renderBookingsTable(filterBySearch(pendingList), 'No pending bookings.')}
            </div>
          )}

          {/* 4. Assign Tasks Section (Directly above Completed Bookings) */}
          {activeSection === 'assign-tasks' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">
                    Total Unassigned Bookings
                  </div>
                  <div className="text-3xl font-bold text-amber-600 mt-2 tabular-nums">
                    {unassignedBookings.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">Total Assigned Tasks</div>
                  <div className="text-3xl font-bold text-blue-700 mt-2 tabular-nums">
                    {taskAssignments.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">Total Completed Tasks</div>
                  <div className="text-3xl font-bold text-emerald-600 mt-2 tabular-nums">
                    {taskAssignments.filter((t) => t.taskStatus === 'Completed').length}
                  </div>
                </div>
              </div>

              {renderAssignTaskBannerBox()}

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                    {[
                      { id: 'unassigned', label: `Unassigned (${unassignedBookings.length})` },
                      { id: 'all-assigned', label: `All Assigned (${taskAssignments.length})` },
                      { id: 'server-wise', label: 'Server-wise Tasks' },
                      {
                        id: 'pending',
                        label: `Pending (${
                          taskAssignments.filter((t) => t.taskStatus !== 'Completed').length
                        })`,
                      },
                      {
                        id: 'completed',
                        label: `Completed (${
                          taskAssignments.filter((t) => t.taskStatus === 'Completed').length
                        })`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setTaskFilter(tab.id as TaskFilterTab)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          taskFilter === tab.id
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {taskFilter === 'server-wise' && (
                    <select
                      value={serverWiseFilterId}
                      onChange={(e) => setServerWiseFilterId(e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium bg-white"
                    >
                      <option value="ALL">All Registered Servers</option>
                      {servers.map((s) => (
                        <option key={s.serverId} value={s.serverId}>
                          {s.serverId} — {s.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {taskFilter === 'unassigned' ? (
                  renderBookingsTable(
                    filterBySearch(unassignedBookings),
                    'All active bookings have been assigned to servers!'
                  )
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Assignment ID</th>
                          <th className="py-3 px-4 font-semibold">Booking ID</th>
                          <th className="py-3 px-4 font-semibold">Server</th>
                          <th className="py-3 px-4 font-semibold">Customer</th>
                          <th className="py-3 px-4 font-semibold">Service</th>
                          <th className="py-3 px-4 font-semibold">Assigned Date</th>
                          <th className="py-3 px-4 font-semibold">Task Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filterBySearch(filteredTasks).map((t) => (
                          <tr key={t.assignmentId} className="hover:bg-blue-50/30">
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                              {t.assignmentId}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                              {t.bookingId}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{t.serverName}</div>
                              <div className="font-mono text-xs text-blue-700">{t.serverId}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-900">{t.customerName}</div>
                              <div className="text-xs text-slate-500">{t.customerPhone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-slate-900">{t.serviceName}</div>
                              <div className="text-xs text-slate-500 tabular-nums">
                                {t.bookingDate} · {t.timeSlot}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 tabular-nums">
                              {t.assignmentDate}
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={t.taskStatus} />
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {t.taskStatus !== 'Completed' ? (
                                <button
                                  type="button"
                                  onClick={() => openAssignPopup(t.bookingId, 'reassign')}
                                  className="inline-flex items-center gap-1 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 cursor-pointer"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Reassign
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400">Done</span>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredTasks.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-10 text-center text-slate-500">
                              No task assignments match this filter.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Completed Bookings */}
          {activeSection === 'completed-bookings' &&
            renderBookingsTable(filterBySearch(completedList), 'No completed bookings yet.')}

          {/* 6. Cancelled Bookings */}
          {activeSection === 'cancelled-bookings' &&
            renderBookingsTable(filterBySearch(cancelledList), 'No cancelled bookings.')}

          {/* 7. Manage Servers */}
          {activeSection === 'manage-servers' && (
            <div className="space-y-6">
              {serverNotice && (
                <div
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    serverNotice.ok
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border border-rose-200 text-rose-800'
                  }`}
                >
                  {serverNotice.message}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <h2 className="text-base font-bold text-[#0B2545]">Register New Server</h2>
                  </div>

                  <form onSubmit={handleAddServer} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Server Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newServerName}
                        onChange={(e) => setNewServerName(e.target.value)}
                        placeholder="e.g. Arjun Verma"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Server ID (Unique)
                      </label>
                      <input
                        type="text"
                        required
                        value={newServerId}
                        onChange={(e) => setNewServerId(e.target.value)}
                        placeholder="e.g. SRV-104"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={newServerPhone}
                        onChange={(e) => setNewServerPhone(e.target.value)}
                        placeholder="9876501234"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Specialty
                      </label>
                      <input
                        type="text"
                        value={newServerSpecialty}
                        onChange={(e) => setNewServerSpecialty(e.target.value)}
                        placeholder="Plumbing & Electrical"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Login Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newServerPassword}
                        onChange={(e) => setNewServerPassword(e.target.value)}
                        placeholder="Set server password"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                    >
                      Save Server Details
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="font-bold text-[#0B2545]">
                      Registered Servers ({servers.length})
                    </h2>
                    <span className="text-xs text-slate-500">Stored in hs_servers</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Server ID</th>
                          <th className="py-3 px-4 font-semibold">Name & Specialty</th>
                          <th className="py-3 px-4 font-semibold">Phone</th>
                          <th className="py-3 px-4 font-semibold">Password</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {servers.map((srv) => (
                          <tr key={srv.serverId} className="hover:bg-blue-50/30">
                            <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                              {srv.serverId}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-slate-900">{srv.name}</div>
                              <div className="text-xs text-slate-500">{srv.specialty}</div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 tabular-nums">{srv.phone}</td>
                            <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                              {srv.password}
                            </td>
                            <td className="py-3.5 px-4">
                              <StatusBadge status={srv.status} />
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                              <button
                                type="button"
                                onClick={() => setEditingServer(srv)}
                                className="inline-flex items-center gap-1 rounded border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                              >
                                <Edit3 className="h-3 w-3" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setServerNotice(deleteServer(srv.serverId))}
                                className="inline-flex items-center gap-1 rounded border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {editingServer && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-6 shadow-xl">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <h3 className="text-lg font-bold text-slate-900">
                        Edit Server ({editingServer.serverId})
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingServer(null)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <form onSubmit={handleSaveEditServer} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Server Name
                        </label>
                        <input
                          type="text"
                          required
                          value={editingServer.name}
                          onChange={(e) =>
                            setEditingServer({ ...editingServer, name: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={editingServer.phone}
                          onChange={(e) =>
                            setEditingServer({ ...editingServer, phone: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Specialty
                        </label>
                        <input
                          type="text"
                          required
                          value={editingServer.specialty}
                          onChange={(e) =>
                            setEditingServer({ ...editingServer, specialty: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Login Password
                        </label>
                        <input
                          type="text"
                          required
                          value={editingServer.password}
                          onChange={(e) =>
                            setEditingServer({ ...editingServer, password: e.target.value })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Status
                        </label>
                        <select
                          value={editingServer.status}
                          onChange={(e) =>
                            setEditingServer({
                              ...editingServer,
                              status: e.target.value as 'Active' | 'Inactive',
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingServer(null)}
                          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                        >
                          Update Server
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 8. Payment Records */}
          {activeSection === 'payment-records' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Payment ID</th>
                      <th className="py-3 px-4 font-semibold">Booking ID</th>
                      <th className="py-3 px-4 font-semibold">Customer</th>
                      <th className="py-3 px-4 font-semibold">Service</th>
                      <th className="py-3 px-4 font-semibold">Payment Method</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Payment Status</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filterBySearch(payments).map((p) => (
                      <tr key={p.paymentId} className="hover:bg-blue-50/30">
                        <td className="py-3.5 px-4 font-mono text-slate-900">{p.paymentId}</td>
                        <td className="py-3.5 px-4 font-mono font-medium text-blue-700">
                          {p.bookingId}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-900">{p.customerName}</td>
                        <td className="py-3.5 px-4 text-slate-700">{p.serviceName}</td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">{p.method}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 tabular-nums">
                          ₹{p.amount}
                        </td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 tabular-nums">{p.date}</td>
                        <td className="py-3.5 px-4 text-right">
                          {p.method === 'Cash' && p.status === 'Pending' ? (
                            <button
                              type="button"
                              onClick={() => setActionNotice(markCashPaymentPaid(p.bookingId))}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 9. Customer Feedback */}
          {activeSection === 'customer-feedback' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((rev) => (
                <div
                  key={rev.reviewId}
                  className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-blue-700 font-semibold">
                        {rev.bookingId}
                      </span>
                      <span className="text-xs font-bold text-amber-600">
                        {rev.rating} / 5 ★
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">{rev.serviceName}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
                    <span className="font-semibold text-slate-800">{rev.customerName}</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div className="col-span-full bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  No customer feedback submitted yet.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Assign Task Popup Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#0B2545]">
                  {assignMode === 'reassign'
                    ? 'Reassign Task to Another Server ID'
                    : 'Assign Task to Server ID'}
                </h2>
                <p className="text-xs text-slate-500">
                  Select a Booking ID and choose a registered Server ID to dispatch this task.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {assignNotice && (
              <div
                className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
                  assignNotice.ok
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {assignNotice.message}
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Booking ID
                  </label>
                  <select
                    value={selectedBookingId}
                    onChange={(e) => {
                      setSelectedBookingId(e.target.value);
                      setAssignNotice(null);
                    }}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-mono bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">-- Select Booking ID --</option>
                    {(assignMode === 'reassign'
                      ? bookings.filter(
                          (b) => b.status !== 'Completed' && b.status !== 'Cancelled'
                        )
                      : unassignedBookings
                    ).map((b) => (
                      <option key={b.bookingId} value={b.bookingId}>
                        {b.bookingId} — {b.serviceName} ({b.customerName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Select Server ID
                  </label>
                  <select
                    value={selectedServerId}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm bg-white focus:border-blue-600 focus:outline-none"
                  >
                    <option value="">-- Select Registered Server ID --</option>
                    {activeServers.map((srv) => (
                      <option key={srv.serverId} value={srv.serverId}>
                        {srv.serverId} — {srv.name} ({srv.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="block text-xs text-slate-500">Customer Name</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBookingDetails?.customerName || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Customer Phone</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {selectedBookingDetails?.customerPhone || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Service Name</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBookingDetails?.serviceName || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Service Price</span>
                  <span className="font-bold text-blue-700 tabular-nums">
                    {selectedBookingDetails ? `₹${selectedBookingDetails.servicePrice}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Booking Date</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {selectedBookingDetails?.bookingDate || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Time Slot</span>
                  <span className="font-semibold text-slate-900">
                    {selectedBookingDetails?.timeSlot || '—'}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-xs text-slate-500">Customer Address</span>
                  <span className="font-medium text-slate-900">
                    {selectedBookingDetails?.address || '—'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 cursor-pointer"
                >
                  {assignMode === 'reassign' ? 'Confirm Reassignment' : 'Assign Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
