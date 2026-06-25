'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => api.get('/admin/departments').then(({ data }) => setDepartments(data.data)).catch(() => {});

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put(`/admin/departments/${editing._id}`, form);
        toast.success('Department updated');
      } else {
        await api.post('/admin/departments', form);
        toast.success('Department created');
      }
      setModal(false);
      setEditing(null);
      setForm({ name: '', description: '' });
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    try { await api.delete(`/admin/departments/${id}`); toast.success('Deleted'); fetchData(); }
    catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">{departments.length} departments</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ name: '', description: '' }); setModal(true); }}><Plus className="w-4 h-4" /> Add Department</Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((d) => (
          <Card key={d._id} hover>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{d.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{d.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(d); setForm({ name: d.name, description: d.description || '' }); setModal(true); }}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(d._id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
