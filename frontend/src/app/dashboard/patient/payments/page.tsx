'use client';
import { useEffect, useState } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PatientPayments() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/payments/history').then(({ data }) => setPayments(data.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
      <p className="text-gray-600 mb-8">View your payment records and invoices</p>

      {payments.length === 0 ? (
        <Card className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No payment records yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => (
            <Card key={payment._id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{payment.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(payment.createdAt)} &bull; {payment.method}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-lg font-bold gradient-text">{formatCurrency(payment.amount)}</p>
                  <Badge variant={payment.status === 'completed' ? 'success' : payment.status === 'refunded' ? 'info' : 'warning'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
