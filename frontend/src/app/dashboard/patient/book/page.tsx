'use client';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useEffect } from 'react';

export default function BookAppointmentRedirect() {
  const router = useRouter();
  useEffect(() => { router.push('/doctors'); }, [router]);
  return <DashboardLayout><div className="text-center py-20 text-gray-500">Redirecting to doctors...</div></DashboardLayout>;
}
