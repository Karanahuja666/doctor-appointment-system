'use client';
import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Appointment } from '@/types';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params: Record<string, string> = { limit: '50' };
      if (filter) params.status = filter;
      const { data } = await api.get('/appointments/my', { params });
      setAppointments(data.data);
    } catch { /* handled by interceptor */ }
  };

  const handleCancel = async () => {
    if (!cancelModal) return;
    try {
      await api.put(`/appointments/${cancelModal}/status`, { status: 'cancelled', cancelReason });
      toast.success('Appointment cancelled');
      setCancelModal(null);
      setCancelReason('');
      fetchAppointments();
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>
        <Button href="/doctors" size="sm"><Calendar className="w-4 h-4" /> Book New</Button>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === s ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-primary-50 border'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <Card key={apt._id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {apt.doctor?.user?.name?.[0] || 'D'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{apt.doctor?.user?.name}</p>
                  <p className="text-sm text-primary-600">{apt.doctor?.specialization}</p>
                  <p className="text-sm text-gray-500">{formatDate(apt.date)} &bull; {apt.timeSlot.start} - {apt.timeSlot.end}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={apt.status} />
                {['pending', 'confirmed'].includes(apt.status) && (
                  <Button variant="danger" size="sm" onClick={() => setCancelModal(apt._id)}>Cancel</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">No appointments found</div>
        )}
      </div>

      <Modal isOpen={!!cancelModal} onClose={() => setCancelModal(null)} title="Cancel Appointment">
        <div className="space-y-4">
          <p className="text-gray-600">Are you sure you want to cancel this appointment?</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
            <textarea rows={3} value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setCancelModal(null)}>Keep</Button>
            <Button variant="danger" onClick={handleCancel}>Cancel Appointment</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
