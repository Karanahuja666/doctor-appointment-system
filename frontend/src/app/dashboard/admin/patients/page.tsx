'use client';
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPatients() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const fetchUsers = () => {
    const params: Record<string, string> = { role: 'patient' };
    if (search) params.search = search;
    api.get('/admin/users', { params }).then(({ data }) => setUsers(data.data)).catch(() => {});
  };

  const toggleStatus = async (id: string, isActive: boolean) => {
    try {
      await api.put(`/admin/users/${id}/status`, { isActive: !isActive });
      toast.success('Status updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Patients</h1>
      <p className="text-gray-600 mb-6">{users.length} patients</p>
      <div className="mb-6 max-w-md">
        <Input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
      </div>
      <div className="space-y-4">
        {users.map((u) => (
          <Card key={u._id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm">{u.name?.[0]}</div>
                <div>
                  <p className="font-medium text-gray-900">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                <Button size="sm" variant={u.isActive ? 'danger' : 'primary'} onClick={() => toggleStatus(u._id, u.isActive)}>
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
