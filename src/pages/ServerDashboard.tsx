import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Clock,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Play,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { TaskAssignment } from '../types';

type ServerSection =
  | 'overview'
  | 'assigned-tasks'
  | 'pending-tasks'
  | 'completed-tasks'
  | 'profile';

export const ServerDashboard: React.FC = () => {
  const { session, servers, taskAssignments, navigate, logout, updateTaskStatus } = useApp();
  const [activeSection, setActiveSection] = useState<ServerSection>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ ok: boolean; message: string } | null>(null);

  // Strictly display only tasks assigned to the currently logged-in Server ID
  const myTasks = useMemo(() => {
    if (!session?.serverId) return [];
    return taskAssignments.filter((t) => t.serverId === session.serverId);
  }, [taskAssignments, session?.serverId]);

  const myPendingTasks = useMemo(
    () => myTasks.filter((t) => t.taskStatus === 'Assigned' || t.taskStatus === 'In Progress'),
    [myTasks]
  );

  const myCompletedTasks = useMemo(
    () => myTasks.filter((t) => t.taskStatus === 'Completed'),
    [myTasks]
  );

  const serverProfile = useMemo(
    () => servers.find((s) => s.serverId === session?.serverId),
    [servers, session?.serverId]
  );

  const handleStatusUpdate = (assignmentId: string, status: 'In Progress' | 'Completed') => {
    const res = updateTaskStatus(assignmentId, status);
    setActionNotice(res);
  };

  const sidebarItems: { id: ServerSection; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'assigned-tasks', label: 'My Assigned Tasks', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'pending-tasks', label: 'Pending Tasks', icon: <Clock className="h-4 w-4" /> },
    { id: 'completed-tasks', label: 'Completed Tasks', icon: <CheckCircle2 className="h-4 w-4" /> },
    { id: 'profile', label: 'My Profile', icon: <User className="h-4 w-4" /> },
  ];

  const renderTasksTable = (rows: TaskAssignment[], emptyMessage: string) => (
    <div className="space-y-4">
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Booking ID</th>
                <th className="py-3 px-4 font-semibold">Customer Name</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Service</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Date & Slot</th>
                <th className="py-3 px-4 font-semibold">Address</th>
                <th className="py-3 px-4 font-semibold">Task Status</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((t) => (
                <tr key={t.assignmentId} className="hover:bg-blue-50/30">
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {t.bookingId}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{t.customerName}</td>
                  <td className="py-3.5 px-4 text-slate-700 tabular-nums whitespace-nowrap">
                    {t.customerPhone}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{t.serviceName}</td>
                  <td className="py-3.5 px-4 font-semibold text-blue-700 tabular-nums">
                    ₹{t.servicePrice}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                    <div>{t.bookingDate}</div>
                    <div className="text-xs text-slate-500">{t.timeSlot}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">{t.serviceAddress}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.taskStatus} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    {t.taskStatus === 'Assigned' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(t.assignmentId, 'In Progress')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                      >
                        <Play className="h-3 w-3" />
                        Start Task
                      </button>
                    )}
                    {t.taskStatus !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusUpdate(t.assignmentId, 'Completed')}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Mark as Completed
                      </button>
                    )}
                    {t.taskStatus === 'Completed' && (
                      <span className="text-xs font-medium text-emerald-700">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-500">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {rows.map((t) => (
          <div key={t.assignmentId} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-sm text-slate-900">{t.bookingId}</span>
              <StatusBadge status={t.taskStatus} />
            </div>
            <div>
              <div className="font-bold text-slate-900">{t.serviceName}</div>
              <div className="text-sm font-semibold text-blue-700 tabular-nums">
                ₹{t.servicePrice}
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-800">Customer:</span> {t.customerName} (
                {t.customerPhone})
              </div>
              <div>
                <span className="font-semibold text-slate-800">Schedule:</span> {t.bookingDate} ·{' '}
                {t.timeSlot}
              </div>
              <div>
                <span className="font-semibold text-slate-800">Address:</span> {t.serviceAddress}
              </div>
            </div>
            {t.taskStatus !== 'Completed' && (
              <div className="flex flex-wrap gap-2 pt-2">
                {t.taskStatus === 'Assigned' && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate(t.assignmentId, 'In Progress')}
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer"
                  >
                    Start Task
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleStatusUpdate(t.assignmentId, 'Completed')}
                  className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white cursor-pointer"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B2545] text-white flex flex-col transition-transform lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-blue-900/70">
          <span className="text-lg font-bold tracking-tight">Server Portal</span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-blue-200 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-4 border-b border-blue-900/70">
          <div className="text-xs text-blue-300">Logged-in Server</div>
          <div className="font-semibold text-sm text-white truncate mt-0.5">{session?.name}</div>
          <div className="text-xs font-mono text-blue-200 mt-0.5">ID: {session?.serverId}</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
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
              {item.id === 'pending-tasks' && myPendingTasks.length > 0 && (
                <span className="rounded bg-amber-400 text-[#0B2545] px-1.5 py-0.5 text-[11px] font-bold tabular-nums">
                  {myPendingTasks.length}
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
            <h1 className="text-lg sm:text-xl font-bold text-[#0B2545]">
              {sidebarItems.find((i) => i.id === activeSection)?.label}
            </h1>
          </div>

          <div className="text-xs sm:text-sm font-mono font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
            Server ID: {session?.serverId}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {actionNotice && (
            <div
              className={`rounded-lg px-4 py-3 text-sm font-medium ${
                actionNotice.ok
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {actionNotice.message}
            </div>
          )}

          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">Total Assigned Tasks</div>
                  <div className="text-3xl font-bold text-[#0B2545] mt-2 tabular-nums">
                    {myTasks.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">Pending Tasks</div>
                  <div className="text-3xl font-bold text-amber-600 mt-2 tabular-nums">
                    {myPendingTasks.length}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="text-sm font-medium text-slate-500">Completed Tasks</div>
                  <div className="text-3xl font-bold text-emerald-600 mt-2 tabular-nums">
                    {myCompletedTasks.length}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-[#0B2545] mb-3">
                  My Assigned Tasks ({session?.serverId})
                </h2>
                {renderTasksTable(
                  myTasks,
                  `No tasks are currently assigned to Server ID ${session?.serverId}.`
                )}
              </div>
            </>
          )}

          {activeSection === 'assigned-tasks' &&
            renderTasksTable(myTasks, `No tasks assigned to ${session?.serverId} yet.`)}

          {activeSection === 'pending-tasks' &&
            renderTasksTable(myPendingTasks, 'You have no pending tasks right now.')}

          {activeSection === 'completed-tasks' &&
            renderTasksTable(myCompletedTasks, 'No completed tasks yet.')}

          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-xl space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="h-14 w-14 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-bold text-xl">
                  {session?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {serverProfile?.name || session?.name}
                  </h2>
                  <p className="text-sm font-mono text-blue-700">
                    Server ID: {serverProfile?.serverId || session?.serverId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-xs text-slate-500">Phone Number</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {serverProfile?.phone || session?.phone}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Specialty</span>
                  <span className="font-semibold text-slate-900">
                    {serverProfile?.specialty || session?.specialty}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Account Status</span>
                  <div className="mt-1">
                    <StatusBadge status={serverProfile?.status || 'Active'} />
                  </div>
                </div>
                <div>
                  <span className="block text-xs text-slate-500">Registered Date</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {serverProfile?.createdAt || '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
