'use client';
import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function MedicalHistory() {
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    api.get('/patients/medical-history').then(({ data }) => setRecords(data.data)).catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Medical History</h1>
      <p className="text-gray-600 mb-8">Your complete medical records</p>

      {records.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No medical records yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record: any, i: number) => (
            <Card key={i}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{record.condition}</h3>
                  <p className="text-sm text-gray-600 mt-1">{record.diagnosis}</p>
                  <p className="text-sm text-gray-500 mt-1">Treatment: {record.treatment}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(record.date)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
