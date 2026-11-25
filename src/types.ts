export type UserRole = 'user' | 'admin' | 'server';

export type BookingStatus =
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type TaskStatus = 'Assigned' | 'In Progress' | 'Completed';

export type AssignmentStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'In Progress'
  | 'Completed';

export type PaymentMethod = 'Cash' | 'Scan to Pay';

export type PaymentStatus = 'Pending' | 'Paid' | 'Refunded' | 'Cancelled';

export type AppView =
  | 'home'
  | 'services'
  | 'login'
  | 'signup'
  | 'admin-login'
  | 'server-login'
  | 'booking'
  | 'user-dashboard'
  | 'admin-dashboard'
  | 'server-dashboard';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  createdAt: string;
}

export interface ServerAccount {
  serverId: string;
  name: string;
  phone: string;
  password: string;
  specialty: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface SessionData {
  role: UserRole;
  id: string;
  name: string;
  email?: string;
  phone?: string;
  serverId?: string;
  specialty?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
}

export interface BookingRecord {
  bookingId: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  servicePrice: number;
  address: string;
  bookingDate: string;
  timeSlot: string;
  status: BookingStatus;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus;
  assignedServerId?: string | null;
  assignedServerName?: string | null;
  assignmentStatus?: AssignmentStatus;
  createdAt: string;
}

export interface PaymentRecord {
  paymentId: string;
  bookingId: string;
  userId: string;
  customerName: string;
  serviceName: string;
  amount: number;
  method: PaymentMethod | string;
  status: PaymentStatus;
  date: string;
}

export interface ReviewRecord {
  reviewId: string;
  bookingId: string;
  userId: string;
  customerName: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TaskAssignment {
  assignmentId: string;
  bookingId: string;
  serverId: string;
  serverName: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  servicePrice: number;
  serviceAddress: string;
  bookingDate: string;
  timeSlot: string;
  assignmentDate: string;
  taskStatus: TaskStatus;
}
