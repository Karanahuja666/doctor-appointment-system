'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Calendar, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  if (!stats) return <DashboardLayout><div className="text-center py-20 text-gray-500">Loading dashboard...</div></DashboardLayout>;

  const statCards = [
    { label: 'Total Doctors', value: stats.totalDoctors, icon: <Stethoscope className="w-6 h-6" />, color: 'from-primary-500 to-cyan-500' },
    { label: 'Total Patients', value: stats.totalPatients, icon: <Users className="w-6 h-6" />, color: 'from-green-500 to-emerald-500' },
    { label: 'Appointments', value: stats.totalAppointments, icon: <Calendar className="w-6 h-6" />, color: 'from-purple-500 to-indigo-500' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: <DollarSign className="w-6 h-6" />, color: 'from-amber-500 to-orange-500' },
    { label: 'Pending', value: stats.pendingAppointments, icon: <Clock className="w-6 h-6" />, color: 'from-red-500 to-pink-500' },
    { label: 'Today', value: stats.todayAppointments, icon: <TrendingUp className="w-6 h-6" />, color: 'from-teal-500 to-green-500' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your healthcare platform</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <CardTitle className="mb-4">Monthly Revenue</CardTitle>
          <Card>
            <div className="space-y-3">
              {stats.monthlyRevenue.length === 0 ? (
                <p className="text-center py-8 text-gray-500">No revenue data yet</p>
              ) : (
                stats.monthlyRevenue.map((m) => {
                  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  const maxRev = Math.max(...stats.monthlyRevenue.map((r) => r.revenue));
                  return (
                    <div key={m._id} className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 w-8">{months[m._id]}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-500 to-cyan-500 h-full rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${maxRev ? (m.revenue / maxRev) * 100 : 0}%` }}>
                          <span className="text-xs text-white font-medium">{formatCurrency(m.revenue)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>

        <div>
          <CardTitle className="mb-4">Recent Appointments</CardTitle>
          <Card>
            {stats.recentAppointments.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No appointments</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {stats.recentAppointments.slice(0, 8).map((apt: any) => (
                  <div key={apt._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{apt.patient?.name || 'Patient'}</p>
                      <p className="text-xs text-gray-500">{formatDate(apt.date)}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
