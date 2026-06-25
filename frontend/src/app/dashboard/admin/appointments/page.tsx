'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter) params.status = filter;
    api.get('/appointments/all', { params }).then(({ data }) => setAppointments(data.data)).catch(() => {});
  }, [filter]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Appointments</h1>
      <p className="text-gray-600 mb-6">{appointments.length} appointments</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border hover:bg-primary-50'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {appointments.map((apt) => (
          <Card key={apt._id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{apt.patient?.name} → {apt.doctor?.user?.name}</p>
                <p className="text-sm text-gray-500">{formatDate(apt.date)} &bull; {apt.timeSlot?.start}</p>
              </div>
              <StatusBadge status={apt.status} />
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
