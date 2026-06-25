'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Appointment } from '@/types';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    api.get('/appointments/my?limit=5').then(({ data }) => {
      setAppointments(data.data);
      const all = data.data as Appointment[];
      setStats({
        total: data.pagination?.total || all.length,
        upcoming: all.filter((a: Appointment) => ['pending', 'confirmed'].includes(a.status)).length,
        completed: all.filter((a: Appointment) => a.status === 'completed').length,
        cancelled: all.filter((a: Appointment) => a.status === 'cancelled').length,
      });
    }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Appointments', value: stats.total, icon: <Calendar className="w-6 h-6" />, color: 'from-primary-500 to-cyan-500' },
    { label: 'Upcoming', value: stats.upcoming, icon: <Clock className="w-6 h-6" />, color: 'from-amber-500 to-orange-500' },
    { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
    { label: 'Cancelled', value: stats.cancelled, icon: <XCircle className="w-6 h-6" />, color: 'from-red-500 to-pink-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here&apos;s an overview of your appointments.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <CardTitle>Recent Appointments</CardTitle>
        <Button href="/dashboard/patient/appointments" variant="ghost" size="sm">View All <ArrowRight className="w-4 h-4" /></Button>
      </div>

      <Card>
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments yet</p>
            <Button href="/doctors" size="sm" className="mt-4">Book Your First Appointment</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold text-sm">
                    {apt.doctor?.user?.name?.[0] || 'D'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.doctor?.user?.name || 'Doctor'}</p>
                    <p className="text-sm text-gray-500">{formatDate(apt.date)} &bull; {apt.timeSlot.start}</p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
