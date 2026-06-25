'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Users, Settings, LogOut, Menu, X,
  Stethoscope, ClipboardList, CreditCard, MessageSquare, Building2,
  Star, UserCog, Bell, FileText, Activity,
} from 'lucide-react';

const sidebarLinks: Record<string, { href: string; label: string; icon: React.ReactNode }[]> = {
  patient: [
    { href: '/dashboard/patient', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/patient/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    { href: '/dashboard/patient/book', label: 'Book Appointment', icon: <ClipboardList className="w-5 h-5" /> },
    { href: '/dashboard/patient/payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { href: '/dashboard/patient/medical-history', label: 'Medical History', icon: <FileText className="w-5 h-5" /> },
    { href: '/dashboard/patient/profile', label: 'Profile', icon: <UserCog className="w-5 h-5" /> },
  ],
  doctor: [
    { href: '/dashboard/doctor', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/doctor/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    { href: '/dashboard/doctor/availability', label: 'Availability', icon: <Activity className="w-5 h-5" /> },
    { href: '/dashboard/doctor/patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { href: '/dashboard/doctor/profile', label: 'Profile', icon: <UserCog className="w-5 h-5" /> },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/admin/doctors', label: 'Doctors', icon: <Stethoscope className="w-5 h-5" /> },
    { href: '/dashboard/admin/patients', label: 'Patients', icon: <Users className="w-5 h-5" /> },
    { href: '/dashboard/admin/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    { href: '/dashboard/admin/departments', label: 'Departments', icon: <Building2 className="w-5 h-5" /> },
    { href: '/dashboard/admin/payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
    { href: '/dashboard/admin/reviews', label: 'Reviews', icon: <Star className="w-5 h-5" /> },
    { href: '/dashboard/admin/contacts', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout, loadUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (!stored) router.push('/login');
    }
  }, [user, loading, router]);

  const links = sidebarLinks[user?.role || 'patient'] || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className={cn('fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-lg font-bold text-gray-900">MediBook</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                pathname === link.href ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}>
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center justify-between px-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
