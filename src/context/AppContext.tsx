import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_ADMIN,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_REVIEWS,
  INITIAL_SERVERS,
  INITIAL_TASK_ASSIGNMENTS,
  INITIAL_USERS,
  SERVICES_CATALOG,
} from '../data/seedData';
import {
  AppView,
  BookingRecord,
  PaymentMethod,
  PaymentRecord,
  ReviewRecord,
  ServerAccount,
  ServiceItem,
  SessionData,
  TaskAssignment,
  TaskStatus,
  UserAccount,
} from '../types';

export const STORAGE_KEYS = {
  USERS: 'hs_users',
  SERVERS: 'hs_servers',
  SESSION: 'hs_session',
  BOOKINGS: 'hs_bookings',
  PAYMENTS: 'hs_payments',
  REVIEWS: 'hs_reviews',
  TASK_ASSIGNMENTS: 'hs_task_assignments',
} as const;

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function readSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

interface ActionResult {
  ok: boolean;
  message: string;
}

interface AppContextValue {
  users: UserAccount[];
  servers: ServerAccount[];
  bookings: BookingRecord[];
  payments: PaymentRecord[];
  reviews: ReviewRecord[];
  taskAssignments: TaskAssignment[];
  services: ServiceItem[];
  session: SessionData | null;
  currentView: AppView;
  selectedServiceIdForBooking: string;
  setSelectedServiceIdForBooking: (serviceId: string) => void;
  navigate: (view: AppView) => void;
  startBookingForService: (serviceId: string) => void;
  loginUser: (email: string, password: string) => ActionResult;
  registerUser: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
  }) => ActionResult;
  loginAdmin: (email: string, password: string) => ActionResult;
  loginServer: (serverId: string, password: string) => ActionResult;
  logout: () => void;
  createBooking: (data: {
    serviceId: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    timeSlot: string;
    address: string;
    paymentMethod: PaymentMethod;
  }) => ActionResult & { bookingId?: string };
  cancelBooking: (bookingId: string) => ActionResult;
  markBookingCompleted: (bookingId: string) => ActionResult;
  markCashPaymentPaid: (bookingId: string) => ActionResult;
  addServer: (data: {
    serverId: string;
    name: string;
    phone: string;
    password: string;
    specialty: string;
  }) => ActionResult;
  updateServer: (
    serverId: string,
    data: {
      name: string;
      phone: string;
      password: string;
      specialty: string;
      status: 'Active' | 'Inactive';
    }
  ) => ActionResult;
  deleteServer: (serverId: string) => ActionResult;
  assignTask: (bookingId: string, serverId: string) => ActionResult;
  reassignTask: (bookingId: string, newServerId: string) => ActionResult;
  updateTaskStatus: (assignmentId: string, newStatus: TaskStatus) => ActionResult;
  submitReview: (data: {
    bookingId: string;
    rating: number;
    comment: string;
  }) => ActionResult;
}

const AppContext = createContext<AppContextValue | null>(null);

function getInitialViewFromSession(session: SessionData | null): AppView {
  if (!session) return 'home';
  if (session.role === 'admin') return 'admin-dashboard';
  if (session.role === 'server') return 'server-dashboard';
  if (session.role === 'user') return 'user-dashboard';
  return 'home';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(() =>
    readStorage(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [servers, setServers] = useState<ServerAccount[]>(() =>
    readStorage(STORAGE_KEYS.SERVERS, INITIAL_SERVERS)
  );
  const [bookings, setBookings] = useState<BookingRecord[]>(() =>
    readStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );
  const [payments, setPayments] = useState<PaymentRecord[]>(() =>
    readStorage(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS)
  );
  const [reviews, setReviews] = useState<ReviewRecord[]>(() =>
    readStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>(() =>
    readStorage(STORAGE_KEYS.TASK_ASSIGNMENTS, INITIAL_TASK_ASSIGNMENTS)
  );
  const [session, setSession] = useState<SessionData | null>(() => readSession());
  const [currentView, setCurrentView] = useState<AppView>(() =>
    getInitialViewFromSession(readSession())
  );
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<string>(
    SERVICES_CATALOG[0].id
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVERS, JSON.stringify(servers));
  }, [servers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASK_ASSIGNMENTS, JSON.stringify(taskAssignments));
  }, [taskAssignments]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === STORAGE_KEYS.USERS && e.newValue) setUsers(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SERVERS && e.newValue) setServers(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.BOOKINGS && e.newValue) setBookings(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.PAYMENTS && e.newValue) setPayments(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.REVIEWS && e.newValue) setReviews(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.TASK_ASSIGNMENTS && e.newValue) {
        setTaskAssignments(JSON.parse(e.newValue));
      }
      if (e.key === STORAGE_KEYS.SESSION) {
        setSession(e.newValue ? (JSON.parse(e.newValue) as SessionData) : null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const navigate = (view: AppView) => {
    if (view === 'admin-dashboard' && session?.role !== 'admin') {
      setCurrentView('admin-login');
      return;
    }
    if (view === 'server-dashboard' && session?.role !== 'server') {
      setCurrentView('server-login');
      return;
    }
    if ((view === 'user-dashboard' || view === 'booking') && session?.role !== 'user') {
      setCurrentView('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startBookingForService = (serviceId: string) => {
    setSelectedServiceIdForBooking(serviceId);
    if (!session || session.role !== 'user') {
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveSession = (nextSession: SessionData) => {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const loginUser = (email: string, password: string): ActionResult => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (!matched) {
      return { ok: false, message: 'Invalid email or password. Please check your credentials.' };
    }
    saveSession({
      role: 'user',
      id: matched.id,
      name: matched.name,
      email: matched.email,
      phone: matched.phone,
    });
    setCurrentView('user-dashboard');
    return { ok: true, message: 'Login successful.' };
  };

  const registerUser = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
  }): ActionResult => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.name.trim() || !cleanEmail || !data.phone.trim() || !data.password.trim()) {
      return { ok: false, message: 'Please fill in all required fields.' };
    }
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        ok: false,
        message: 'This email is already registered. Please sign in instead.',
      };
    }
    const newUser: UserAccount = {
      id: `USR-${1001 + users.length}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password: data.password,
      address: data.address.trim() || 'Bengaluru',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    saveSession({
      role: 'user',
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    });
    setCurrentView('user-dashboard');
    return { ok: true, message: 'Signup successful! Welcome to Home Service Booking.' };
  };

  const loginAdmin = (email: string, password: string): ActionResult => {
    const cleanEmail = email.trim().toLowerCase();
    if (
      cleanEmail !== DEFAULT_ADMIN.email.toLowerCase() ||
      password !== DEFAULT_ADMIN.password
    ) {
      return {
        ok: false,
        message: 'Incorrect Admin email or password. Please try again.',
      };
    }
    saveSession({
      role: 'admin',
      id: DEFAULT_ADMIN.id,
      name: DEFAULT_ADMIN.name,
      email: DEFAULT_ADMIN.email,
    });
    setCurrentView('admin-dashboard');
    return { ok: true, message: 'Admin login successful.' };
  };

  const loginServer = (serverId: string, password: string): ActionResult => {
    const cleanId = serverId.trim().toUpperCase();
    const currentServers = readStorage<ServerAccount[]>(STORAGE_KEYS.SERVERS, servers);
    const matched = currentServers.find(
      (s) => s.serverId.toUpperCase() === cleanId && s.password === password
    );
    if (!matched) {
      return {
        ok: false,
        message: 'Invalid Server ID or password. Only registered servers can log in.',
      };
    }
    if (matched.status === 'Inactive') {
      return {
        ok: false,
        message: 'This server account is currently inactive. Contact the administrator.',
      };
    }
    saveSession({
      role: 'server',
      id: matched.serverId,
      serverId: matched.serverId,
      name: matched.name,
      phone: matched.phone,
      specialty: matched.specialty,
    });
    setCurrentView('server-dashboard');
    return { ok: true, message: 'Server login successful.' };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setSession(null);
    setCurrentView('home');
  };

  const createBooking = (data: {
    serviceId: string;
    customerName: string;
    customerPhone: string;
    bookingDate: string;
    timeSlot: string;
    address: string;
    paymentMethod: PaymentMethod;
  }): ActionResult & { bookingId?: string } => {
    if (!session || session.role !== 'user') {
      return { ok: false, message: 'Please login as a User to book a service.' };
    }
    if (!data.bookingDate || !data.timeSlot) {
      return { ok: false, message: 'Please select both a booking date and preferred time slot.' };
    }
    if (!data.customerName.trim() || !data.customerPhone.trim() || !data.address.trim()) {
      return { ok: false, message: 'Please enter your name, mobile number, and address.' };
    }

    const service = SERVICES_CATALOG.find((s) => s.id === data.serviceId);
    if (!service) {
      return { ok: false, message: 'Selected service was not found.' };
    }

    const bookingId = `BK-2026-${101 + bookings.length}`;
    const today = new Date().toISOString().split('T')[0];
    const initialPaymentStatus = data.paymentMethod === 'Scan to Pay' ? 'Paid' : 'Pending';

    const newBooking: BookingRecord = {
      bookingId,
      userId: session.id,
      customerName: data.customerName.trim(),
      customerPhone: data.customerPhone.trim(),
      customerEmail: session.email || '',
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      servicePrice: service.price,
      address: data.address.trim(),
      bookingDate: data.bookingDate,
      timeSlot: data.timeSlot,
      status: 'Pending',
      paymentMethod: data.paymentMethod,
      paymentStatus: initialPaymentStatus,
      assignedServerId: null,
      assignedServerName: null,
      assignmentStatus: 'Unassigned',
      createdAt: today,
    };

    const newPayment: PaymentRecord = {
      paymentId: `PAY-${9001 + payments.length}`,
      bookingId,
      userId: session.id,
      customerName: data.customerName.trim(),
      serviceName: service.name,
      amount: service.price,
      method: data.paymentMethod,
      status: initialPaymentStatus,
      date: today,
    };

    setBookings((prev) => [newBooking, ...prev]);
    setPayments((prev) => [newPayment, ...prev]);

    return {
      ok: true,
      message: `Booking confirmed! Your Booking ID is ${bookingId}.`,
      bookingId,
    };
  };

  const cancelBooking = (bookingId: string): ActionResult => {
    const target = bookings.find((b) => b.bookingId === bookingId);
    if (!target) return { ok: false, message: 'Booking not found.' };
    if (target.status === 'Completed' || target.status === 'Cancelled') {
      return { ok: false, message: 'Completed or cancelled bookings cannot be cancelled.' };
    }

    const nextPaymentStatus = target.paymentStatus === 'Paid' ? 'Refunded' : 'Cancelled';

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: 'Cancelled', paymentStatus: nextPaymentStatus }
          : b
      )
    );
    setPayments((prev) =>
      prev.map((p) => (p.bookingId === bookingId ? { ...p, status: nextPaymentStatus } : p))
    );
    setTaskAssignments((prev) => prev.filter((t) => t.bookingId !== bookingId));

    return { ok: true, message: `Booking ${bookingId} has been cancelled.` };
  };

  const markBookingCompleted = (bookingId: string): ActionResult => {
    if (session?.role !== 'admin') {
      return { ok: false, message: 'Only Admin can mark bookings as Completed.' };
    }
    const target = bookings.find((b) => b.bookingId === bookingId);
    if (!target) return { ok: false, message: 'Booking not found.' };
    if (target.status === 'Cancelled') {
      return { ok: false, message: 'Cancelled bookings cannot be marked as Completed.' };
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              status: 'Completed',
              assignmentStatus: b.assignedServerId ? 'Completed' : b.assignmentStatus,
            }
          : b
      )
    );
    setTaskAssignments((prev) =>
      prev.map((t) => (t.bookingId === bookingId ? { ...t, taskStatus: 'Completed' } : t))
    );
    return { ok: true, message: `Booking ${bookingId} marked as Completed.` };
  };

  const markCashPaymentPaid = (bookingId: string): ActionResult => {
    if (session?.role !== 'admin') {
      return { ok: false, message: 'Only Admin can update payment status.' };
    }
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, paymentStatus: 'Paid' } : b))
    );
    setPayments((prev) =>
      prev.map((p) => (p.bookingId === bookingId ? { ...p, status: 'Paid' } : p))
    );
    return { ok: true, message: `Payment for ${bookingId} marked as Paid.` };
  };

  const addServer = (data: {
    serverId: string;
    name: string;
    phone: string;
    password: string;
    specialty: string;
  }): ActionResult => {
    const cleanId = data.serverId.trim().toUpperCase();
    if (!cleanId || !data.name.trim() || !data.phone.trim() || !data.password.trim()) {
      return { ok: false, message: 'All server fields are required.' };
    }
    if (servers.some((s) => s.serverId.toUpperCase() === cleanId)) {
      return {
        ok: false,
        message: `Server ID "${cleanId}" already exists. Each server must have a unique Server ID.`,
      };
    }
    const newServer: ServerAccount = {
      serverId: cleanId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      password: data.password,
      specialty: data.specialty.trim() || 'General Home Services',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setServers((prev) => [...prev, newServer]);
    return { ok: true, message: `Server ${newServer.name} (${cleanId}) registered successfully.` };
  };

  const updateServer = (
    serverId: string,
    data: {
      name: string;
      phone: string;
      password: string;
      specialty: string;
      status: 'Active' | 'Inactive';
    }
  ): ActionResult => {
    const cleanId = serverId.toUpperCase();
    if (!servers.some((s) => s.serverId.toUpperCase() === cleanId)) {
      return { ok: false, message: 'Server not found.' };
    }
    const trimmedName = data.name.trim();
    setServers((prev) =>
      prev.map((s) =>
        s.serverId.toUpperCase() === cleanId
          ? {
              ...s,
              name: trimmedName,
              phone: data.phone.trim(),
              password: data.password,
              specialty: data.specialty.trim() || 'General Home Services',
              status: data.status,
            }
          : s
      )
    );
    setBookings((prev) =>
      prev.map((b) =>
        b.assignedServerId?.toUpperCase() === cleanId
          ? { ...b, assignedServerName: trimmedName }
          : b
      )
    );
    setTaskAssignments((prev) =>
      prev.map((t) =>
        t.serverId.toUpperCase() === cleanId ? { ...t, serverName: trimmedName } : t
      )
    );
    return { ok: true, message: `Server ${cleanId} updated successfully.` };
  };

  const deleteServer = (serverId: string): ActionResult => {
    const cleanId = serverId.toUpperCase();
    const hasActiveTasks = taskAssignments.some(
      (t) => t.serverId.toUpperCase() === cleanId && t.taskStatus !== 'Completed'
    );
    if (hasActiveTasks) {
      return {
        ok: false,
        message: `Cannot delete ${cleanId} because they have active tasks. Reassign them first.`,
      };
    }
    setServers((prev) => prev.filter((s) => s.serverId.toUpperCase() !== cleanId));
    return { ok: true, message: `Server ${cleanId} deleted.` };
  };

  const assignTask = (bookingId: string, serverId: string): ActionResult => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return { ok: false, message: 'Selected booking was not found.' };
    if (booking.status === 'Cancelled' || booking.status === 'Completed') {
      return {
        ok: false,
        message: `Cannot assign booking ${bookingId} because it is ${booking.status}.`,
      };
    }
    if (booking.assignedServerId || taskAssignments.some((t) => t.bookingId === bookingId)) {
      return {
        ok: false,
        message: `Booking ${bookingId} is already assigned to ${booking.assignedServerId}. Use Reassign to change the server.`,
      };
    }

    const server = servers.find((s) => s.serverId === serverId);
    if (!server) return { ok: false, message: 'Selected server was not found.' };

    const today = new Date().toISOString().split('T')[0];
    const newTask: TaskAssignment = {
      assignmentId: `TSK-${5001 + taskAssignments.length}`,
      bookingId: booking.bookingId,
      serverId: server.serverId,
      serverName: server.name,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      serviceName: booking.serviceName,
      servicePrice: booking.servicePrice,
      serviceAddress: booking.address,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      assignmentDate: today,
      taskStatus: 'Assigned',
    };

    setTaskAssignments((prev) => [newTask, ...prev]);
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              status: 'Assigned',
              assignedServerId: server.serverId,
              assignedServerName: server.name,
              assignmentStatus: 'Assigned',
            }
          : b
      )
    );

    return {
      ok: true,
      message: `Task assigned to ${server.name} (Server ID: ${server.serverId}).`,
    };
  };

  const reassignTask = (bookingId: string, newServerId: string): ActionResult => {
    const booking = bookings.find((b) => b.bookingId === bookingId);
    if (!booking) return { ok: false, message: 'Booking not found.' };
    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return { ok: false, message: `Cannot reassign a ${booking.status.toLowerCase()} booking.` };
    }

    const newServer = servers.find((s) => s.serverId === newServerId);
    if (!newServer) return { ok: false, message: 'Selected server not found.' };
    if (booking.assignedServerId === newServer.serverId) {
      return { ok: false, message: `Booking ${bookingId} is already assigned to ${newServer.serverId}.` };
    }

    const today = new Date().toISOString().split('T')[0];
    const existingTask = taskAssignments.find((t) => t.bookingId === bookingId);

    if (existingTask) {
      setTaskAssignments((prev) =>
        prev.map((t) =>
          t.bookingId === bookingId
            ? {
                ...t,
                serverId: newServer.serverId,
                serverName: newServer.name,
                assignmentDate: today,
                taskStatus: 'Assigned',
              }
            : t
        )
      );
    } else {
      const createdTask: TaskAssignment = {
        assignmentId: `TSK-${5001 + taskAssignments.length}`,
        bookingId: booking.bookingId,
        serverId: newServer.serverId,
        serverName: newServer.name,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        serviceName: booking.serviceName,
        servicePrice: booking.servicePrice,
        serviceAddress: booking.address,
        bookingDate: booking.bookingDate,
        timeSlot: booking.timeSlot,
        assignmentDate: today,
        taskStatus: 'Assigned',
      };
      setTaskAssignments((prev) => [createdTask, ...prev]);
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? {
              ...b,
              status: 'Assigned',
              assignedServerId: newServer.serverId,
              assignedServerName: newServer.name,
              assignmentStatus: 'Assigned',
            }
          : b
      )
    );

    return {
      ok: true,
      message: `Booking ${bookingId} reassigned to ${newServer.name} (Server ID: ${newServer.serverId}).`,
    };
  };

  const updateTaskStatus = (assignmentId: string, newStatus: TaskStatus): ActionResult => {
    const task = taskAssignments.find((t) => t.assignmentId === assignmentId);
    if (!task) return { ok: false, message: 'Task assignment not found.' };

    if (session?.role === 'server' && task.serverId !== session.serverId) {
      return {
        ok: false,
        message: 'Unauthorized: You can only update tasks assigned to your Server ID.',
      };
    }

    setTaskAssignments((prev) =>
      prev.map((t) => (t.assignmentId === assignmentId ? { ...t, taskStatus: newStatus } : t))
    );
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === task.bookingId
          ? { ...b, status: newStatus, assignmentStatus: newStatus }
          : b
      )
    );

    return { ok: true, message: `Task ${task.bookingId} updated to "${newStatus}".` };
  };

  const submitReview = (data: {
    bookingId: string;
    rating: number;
    comment: string;
  }): ActionResult => {
    if (!session || session.role !== 'user') {
      return { ok: false, message: 'Please log in as a User to submit reviews.' };
    }
    const booking = bookings.find((b) => b.bookingId === data.bookingId);
    if (!booking) return { ok: false, message: 'Booking not found.' };
    if (booking.status !== 'Completed') {
      return {
        ok: false,
        message: 'You can submit feedback only after the booking is marked Completed.',
      };
    }
    if (reviews.some((r) => r.bookingId === data.bookingId)) {
      return { ok: false, message: 'You have already submitted a review for this booking.' };
    }
    if (!data.comment.trim()) {
      return { ok: false, message: 'Please enter a short review comment.' };
    }

    const newReview: ReviewRecord = {
      reviewId: `REV-${301 + reviews.length}`,
      bookingId: booking.bookingId,
      userId: session.id,
      customerName: session.name,
      serviceName: booking.serviceName,
      rating: data.rating,
      comment: data.comment.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => [newReview, ...prev]);
    return { ok: true, message: 'Thank you! Your rating and feedback have been saved.' };
  };

  return (
    <AppContext.Provider
      value={{
        users,
        servers,
        bookings,
        payments,
        reviews,
        taskAssignments,
        services: SERVICES_CATALOG,
        session,
        currentView,
        selectedServiceIdForBooking,
        setSelectedServiceIdForBooking,
        navigate,
        startBookingForService,
        loginUser,
        registerUser,
        loginAdmin,
        loginServer,
        logout,
        createBooking,
        cancelBooking,
        markBookingCompleted,
        markCashPaymentPaid,
        addServer,
        updateServer,
        deleteServer,
        assignTask,
        reassignTask,
        updateTaskStatus,
        submitReview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
