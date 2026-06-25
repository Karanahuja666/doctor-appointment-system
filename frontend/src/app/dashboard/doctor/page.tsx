'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Star, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({ totalAppointments: 0, todayAppointments: 0, pendingAppointments: 0, completedAppointments: 0, rating: 0, totalReviews: 0 });
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/doctors/stats').then(({ data }) => setStats(data.data)).catch(() => {});
    api.get('/appointments/doctor?limit=5').then(({ data }) => setAppointments(data.data)).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Today\'s Appointments', value: stats.todayAppointments, icon: <Calendar className="w-6 h-6" />, color: 'from-primary-500 to-cyan-500' },
    { label: 'Pending Approvals', value: stats.pendingAppointments, icon: <AlertCircle className="w-6 h-6" />, color: 'from-amber-500 to-orange-500' },
    { label: 'Completed', value: stats.completedAppointments, icon: <CheckCircle2 className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
    { label: 'Rating', value: stats.rating.toFixed(1), icon: <Star className="w-6 h-6" />, color: 'from-purple-500 to-indigo-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600">Manage your appointments and patients</p>
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

      <CardTitle className="mb-4">Recent Appointments</CardTitle>
      <Card>
        {appointments.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No recent appointments</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((apt: any) => (
              <div key={apt._id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-semibold text-sm">
                    {apt.patient?.name?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{apt.patient?.name}</p>
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
