'use client';
import { useEffect, useState } from 'react';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface Slot { start: string; end: string; }
interface DayAvailability { day: string; isAvailable: boolean; slots: Slot[]; }

export default function DoctorAvailability() {
  const [availability, setAvailability] = useState<DayAvailability[]>(
    days.map((day) => ({ day, isAvailable: ['saturday', 'sunday'].includes(day) ? false : true, slots: [] }))
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      if (data.data.profile?.availability?.length) {
        setAvailability(data.data.profile.availability);
      }
    }).catch(() => {});
  }, []);

  const toggleDay = (day: string) => {
    setAvailability((prev) => prev.map((a) => a.day === day ? { ...a, isAvailable: !a.isAvailable } : a));
  };

  const addSlot = (day: string) => {
    setAvailability((prev) => prev.map((a) => a.day === day ? { ...a, slots: [...a.slots, { start: '09:00', end: '09:30' }] } : a));
  };

  const removeSlot = (day: string, index: number) => {
    setAvailability((prev) => prev.map((a) => a.day === day ? { ...a, slots: a.slots.filter((_, i) => i !== index) } : a));
  };

  const updateSlot = (day: string, index: number, field: 'start' | 'end', value: string) => {
    setAvailability((prev) => prev.map((a) => a.day === day ? { ...a, slots: a.slots.map((s, i) => i === index ? { ...s, [field]: value } : s) } : a));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/doctors/availability', { availability });
      toast.success('Availability updated!');
    } catch { toast.error('Failed to update'); }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
          <p className="text-gray-600">Set your available days and time slots</p>
        </div>
        <Button onClick={handleSave} loading={loading}><Save className="w-4 h-4" /> Save</Button>
      </div>

      <div className="space-y-4">
        {availability.map((dayData) => (
          <Card key={dayData.day}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleDay(dayData.day)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${dayData.isAvailable ? 'bg-primary-500' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${dayData.isAvailable ? 'left-6' : 'left-0.5'}`} />
                </button>
                <h3 className="font-semibold text-gray-900 capitalize">{dayData.day}</h3>
              </div>
              {dayData.isAvailable && (
                <Button size="sm" variant="ghost" onClick={() => addSlot(dayData.day)}><Plus className="w-4 h-4" /> Add Slot</Button>
              )}
            </div>
            {dayData.isAvailable && (
              <div className="space-y-2">
                {dayData.slots.length === 0 && <p className="text-sm text-gray-400">No slots added. Click &quot;Add Slot&quot; to create time slots.</p>}
                {dayData.slots.map((slot, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <input type="time" value={slot.start} onChange={(e) => updateSlot(dayData.day, i, 'start', e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
                    <span className="text-gray-400">to</span>
                    <input type="time" value={slot.end} onChange={(e) => updateSlot(dayData.day, i, 'end', e.target.value)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none" />
                    <button onClick={() => removeSlot(dayData.day, i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
