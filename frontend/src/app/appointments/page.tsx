'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatCurrency, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Doctor, TimeSlot } from '@/types';

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctor');

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [type, setType] = useState<'in-person' | 'video'>('in-person');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (doctorId) {
      api.get(`/doctors/${doctorId}`).then(({ data }) => setDoctor(data.data)).catch(() => {});
    }
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && date) {
      api.get('/appointments/slots', { params: { doctorId, date } })
        .then(({ data }) => setSlots(data.data.slots || []))
        .catch(() => setSlots([]));
    }
  }, [doctorId, date]);

  const handleBook = async () => {
    if (!selectedSlot || !reason) { toast.error('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      await api.post('/appointments', {
        doctorId,
        date,
        timeSlot: { start: selectedSlot.start, end: selectedSlot.end },
        type,
        reason,
        symptoms: symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      });
      setBooked(true);
      toast.success('Appointment booked successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (booked) {
    return (
      <div className="text-center py-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-600 mb-8">You will receive a confirmation email shortly.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/dashboard/patient/appointments')}>View Appointments</Button>
          <Button variant="outline" onClick={() => router.push('/doctors')}>Browse Doctors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {doctor && (
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold">
              {getInitials(doctor.user?.name || 'DR')}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{doctor.user?.name}</h2>
              <p className="text-primary-600">{doctor.specialization}</p>
              <p className="text-sm text-gray-500">Fee: {formatCurrency(doctor.fees)}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary-500" /> Select Date & Time</h3>
          <Input type="date" label="Date" value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} min={new Date().toISOString().split('T')[0]} required />
          {date && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Available Slots</p>
              {slots.length === 0 ? (
                <p className="text-sm text-gray-500">No slots available for this date</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((slot) => (
                    <button key={slot.start} onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all border ${selectedSlot?.start === slot.start ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'}`}>
                      <Clock className="w-3 h-3 inline mr-1" />{slot.start}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Consultation Type</p>
              <div className="flex gap-3">
                {(['in-person', 'video'] as const).map((t) => (
                  <button key={t} onClick={() => setType(t)}
                    className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${type === t ? 'bg-primary-50 border-primary-500 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
                    {t === 'video' ? <Video className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {t === 'video' ? 'Video Call' : 'In-Person'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Visit *</label>
              <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe your reason..."
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" required />
            </div>
            <Input label="Symptoms (comma separated)" placeholder="Headache, Fever, Cough..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
            <Button onClick={handleBook} loading={loading} className="w-full" size="lg" disabled={!selectedSlot || !reason}>
              Confirm Booking
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 hero-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <BookingContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </>
  );
}
