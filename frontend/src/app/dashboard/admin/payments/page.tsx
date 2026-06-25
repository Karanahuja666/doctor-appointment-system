'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  const fetchPayments = () => {
    api.get('/payments/history').then(({ data }) => setPayments(data.data)).catch(() => {});
  };

  useEffect(() => { fetchPayments(); }, []);

  const handleRefund = async (id: string) => {
    if (!confirm('Refund this payment?')) return;
    try {
      await api.put(`/payments/${id}/refund`);
      toast.success('Refunded');
      fetchPayments();
    } catch { toast.error('Failed'); }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payments</h1>
      <p className="text-gray-600 mb-8">{payments.length} transactions</p>
      <div className="space-y-4">
        {payments.map((p) => (
          <Card key={p._id}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{p.invoiceNumber}</p>
                <p className="text-sm text-gray-500">{p.patient?.name} &bull; {formatDate(p.createdAt)} &bull; {p.method}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-bold gradient-text">{formatCurrency(p.amount)}</p>
                <Badge variant={p.status === 'completed' ? 'success' : p.status === 'refunded' ? 'info' : 'warning'}>{p.status}</Badge>
                {p.status === 'completed' && <Button size="sm" variant="outline" onClick={() => handleRefund(p._id)}>Refund</Button>}
              </div>
            </div>
          </Card>
        ))}
        {payments.length === 0 && <div className="text-center py-12 text-gray-500">No payment records</div>}
      </div>
    </DashboardLayout>
  );
}
