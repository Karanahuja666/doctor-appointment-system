'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Appointment } from '@/types';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('');
  const [prescriptionModal, setPrescriptionModal] = useState<string | null>(null);
  const [prescription, setPrescription] = useState({ medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], advice: '', consultationNotes: '' });

  useEffect(() => { fetchAppointments(); }, [filter]);

  const fetchAppointments = async () => {
    try {
      const params: Record<string, string> = { limit: '50' };
      if (filter) params.status = filter;
      const { data } = await api.get('/appointments/doctor', { params });
      setAppointments(data.data);
    } catch { /* handled by interceptor */ }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch { toast.error('Failed to update'); }
  };

  const addPrescription = async () => {
    if (!prescriptionModal) return;
    try {
      await api.put(`/appointments/${prescriptionModal}/prescription`, {
        prescription: { medicines: prescription.medicines.filter((m) => m.name), advice: prescription.advice },
        consultationNotes: prescription.consultationNotes,
      });
      toast.success('Prescription added');
      setPrescriptionModal(null);
      fetchAppointments();
    } catch { toast.error('Failed to add prescription'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments</h1>
      <p className="text-gray-600 mb-6">Manage patient appointments</p>

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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                  {apt.patient?.name?.[0] || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(apt.date)} &bull; {apt.timeSlot.start} - {apt.timeSlot.end}</p>
                  <p className="text-sm text-gray-600">Reason: {apt.reason}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={apt.status} />
                {apt.status === 'pending' && (
                  <>
                    <Button size="sm" onClick={() => updateStatus(apt._id, 'confirmed')}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => updateStatus(apt._id, 'cancelled')}>Reject</Button>
                  </>
                )}
                {apt.status === 'confirmed' && (
                  <Button size="sm" variant="secondary" onClick={() => { setPrescription({ medicines: [{ name: '', dosage: '', frequency: '', duration: '' }], advice: '', consultationNotes: '' }); setPrescriptionModal(apt._id); }}>Add Prescription</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {appointments.length === 0 && <div className="text-center py-12 text-gray-500">No appointments found</div>}
      </div>

      <Modal isOpen={!!prescriptionModal} onClose={() => setPrescriptionModal(null)} title="Add Prescription" className="max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
            {prescription.medicines.map((med, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                <input placeholder="Medicine" value={med.name} onChange={(e) => { const m = [...prescription.medicines]; m[i].name = e.target.value; setPrescription({ ...prescription, medicines: m }); }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
                <input placeholder="Dosage" value={med.dosage} onChange={(e) => { const m = [...prescription.medicines]; m[i].dosage = e.target.value; setPrescription({ ...prescription, medicines: m }); }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
                <input placeholder="Frequency" value={med.frequency} onChange={(e) => { const m = [...prescription.medicines]; m[i].frequency = e.target.value; setPrescription({ ...prescription, medicines: m }); }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
                <input placeholder="Duration" value={med.duration} onChange={(e) => { const m = [...prescription.medicines]; m[i].duration = e.target.value; setPrescription({ ...prescription, medicines: m }); }}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
              </div>
            ))}
            <button onClick={() => setPrescription({ ...prescription, medicines: [...prescription.medicines, { name: '', dosage: '', frequency: '', duration: '' }] })}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium">+ Add Medicine</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
            <textarea rows={2} value={prescription.advice} onChange={(e) => setPrescription({ ...prescription, advice: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Notes</label>
            <textarea rows={3} value={prescription.consultationNotes} onChange={(e) => setPrescription({ ...prescription, consultationNotes: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setPrescriptionModal(null)}>Cancel</Button>
            <Button onClick={addPrescription}>Save & Complete</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
