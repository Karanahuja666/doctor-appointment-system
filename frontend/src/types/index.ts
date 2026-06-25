export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  phone?: string;
  avatar?: string;
  gender?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Doctor {
  _id: string;
  user: User;
  specialization: string;
  department?: { _id: string; name: string };
  qualification: string;
  experience: number;
  fees: number;
  bio?: string;
  languages: string[];
  availability: Availability[];
  rating: number;
  totalReviews: number;
  isApproved: boolean;
  consultationType: string[];
}

export interface Availability {
  day: string;
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  isBooked?: boolean;
  available?: boolean;
}

export interface Appointment {
  _id: string;
  patient: User;
  doctor: Doctor;
  date: string;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  type: 'in-person' | 'video';
  reason: string;
  symptoms?: string[];
  prescription?: Prescription;
  consultationNotes?: string;
  payment?: Payment;
  createdAt: string;
}

export interface Prescription {
  medicines: Medicine[];
  advice?: string;
  followUpDate?: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Payment {
  _id: string;
  amount: number;
  currency: string;
  method: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  invoiceNumber: string;
  paidAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  patient: User;
  doctor: Doctor;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalRevenue: number;
  pendingAppointments: number;
  todayAppointments: number;
  recentAppointments: Appointment[];
  monthlyRevenue: { _id: number; revenue: number; count: number }[];
}
