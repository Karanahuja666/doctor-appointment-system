'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => { fetchDoctors(); }, []);

  const fetchDoctors = () => {
    api.get('/doctors/admin/all').then(({ data }) => setDoctors(data.data)).catch(() => {});
  };

  const toggleApproval = async (id: string, current: boolean) => {
    try {
      await api.put(`/doctors/${id}/approve`, { isApproved: !current });
      toast.success(`Doctor ${!current ? 'approved' : 'unapproved'}`);
      fetchDoctors();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Doctors</h1>
      <p className="text-gray-600 mb-8">{doctors.length} doctors registered</p>

      <div className="space-y-4">
        {doctors.map((doc) => (
          <Card key={doc._id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {doc.user?.name?.[0] || 'D'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{doc.user?.name}</p>
                  <p className="text-sm text-primary-600">{doc.specialization}</p>
                  <p className="text-sm text-gray-500">{doc.user?.email} &bull; {doc.experience} yrs exp</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.isApproved ? 'success' : 'warning'}>{doc.isApproved ? 'Approved' : 'Pending'}</Badge>
                <Button size="sm" variant={doc.isApproved ? 'outline' : 'primary'} onClick={() => toggleApproval(doc._id, doc.isApproved)}>
                  {doc.isApproved ? 'Unapprove' : 'Approve'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
