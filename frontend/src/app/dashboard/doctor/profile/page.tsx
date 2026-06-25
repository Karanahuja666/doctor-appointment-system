'use client';
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DoctorProfile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '', qualification: '', experience: '', fees: '', bio: '', languages: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      const u = data.data.user;
      const p = data.data.profile;
      setForm({
        name: u.name || '', email: u.email || '', phone: u.phone || '',
        specialization: p?.specialization || '', qualification: p?.qualification || '',
        experience: p?.experience?.toString() || '', fees: p?.fees?.toString() || '',
        bio: p?.bio || '', languages: p?.languages?.join(', ') || '',
      });
    }).catch(() => {});
  }, []);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/auth/profile', { name: form.name, phone: form.phone });
      await api.put('/doctors/profile', {
        specialization: form.specialization, qualification: form.qualification,
        experience: parseInt(form.experience), fees: parseInt(form.fees),
        bio: form.bio, languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
      });
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); }
    setLoading(false);
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
            <Input label="Specialization" value={form.specialization} onChange={(e) => update('specialization', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Qualification" value={form.qualification} onChange={(e) => update('qualification', e.target.value)} />
            <Input label="Experience (years)" type="number" value={form.experience} onChange={(e) => update('experience', e.target.value)} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input label="Consultation Fee ($)" type="number" value={form.fees} onChange={(e) => update('fees', e.target.value)} />
            <Input label="Languages (comma separated)" value={form.languages} onChange={(e) => update('languages', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea rows={4} value={form.bio} onChange={(e) => update('bio', e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" />
          </div>
          <Button onClick={handleSave} loading={loading}><Save className="w-4 h-4" /> Save Changes</Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}
