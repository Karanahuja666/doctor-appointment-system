'use client';
import { useEffect, useState } from 'react';
import { User, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PatientProfile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: '', dateOfBirth: '', bloodGroup: '', allergies: '', currentMedications: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      const user = data.data.user;
      const profile = data.data.profile;
      setForm({
        name: user.name || '', email: user.email || '', phone: user.phone || '',
        gender: user.gender || '', dateOfBirth: user.dateOfBirth?.split('T')[0] || '',
        bloodGroup: profile?.bloodGroup || '', allergies: profile?.allergies?.join(', ') || '',
        currentMedications: profile?.currentMedications?.join(', ') || '',
      });
    }).catch(() => {});
  }, []);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', { name: form.name, phone: form.phone, gender: form.gender, dateOfBirth: form.dateOfBirth });
      await api.put('/patients/profile', {
        bloodGroup: form.bloodGroup,
        allergies: form.allergies.split(',').map((a) => a.trim()).filter(Boolean),
        currentMedications: form.currentMedications.split(',').map((m) => m.trim()).filter(Boolean),
      });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>
      <Card className="max-w-2xl">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Full Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
            <Input label="Email" value={form.email} disabled />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
              <select value={form.bloodGroup} onChange={(e) => update('bloodGroup', e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none">
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
          </div>
          <Input label="Allergies (comma separated)" value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="Peanuts, Penicillin..." />
          <Input label="Current Medications (comma separated)" value={form.currentMedications} onChange={(e) => update('currentMedications', e.target.value)} placeholder="Aspirin, Metformin..." />
          <Button onClick={handleSave} loading={loading}><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
