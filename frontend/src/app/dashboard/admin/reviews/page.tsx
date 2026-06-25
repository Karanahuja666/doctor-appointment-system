'use client';
import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => { fetchData(); }, []);
  const fetchData = () => api.get('/admin/reviews').then(({ data }) => setReviews(data.data)).catch(() => {});

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try { await api.delete(`/admin/reviews/${id}`); toast.success('Deleted'); fetchData(); } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h1>
      <p className="text-gray-600 mb-8">{reviews.length} reviews</p>
      <div className="space-y-4">
        {reviews.map((r) => (
          <Card key={r._id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{r.patient?.name}</p>
                  <span className="text-gray-400">→</span>
                  <p className="text-primary-600">{r.doctor?.user?.name}</p>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(r.createdAt)}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(r._id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
        {reviews.length === 0 && <div className="text-center py-12 text-gray-500">No reviews yet</div>}
      </div>
    </DashboardLayout>
  );
}
