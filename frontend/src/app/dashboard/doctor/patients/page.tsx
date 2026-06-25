'use client';
import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function DoctorPatients() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/appointments/doctor?limit=100').then(({ data }) => setAppointments(data.data)).catch(() => {});
  }, []);

  const uniquePatients = Array.from(new Map(appointments.map((a: any) => [a.patient?._id, a.patient])).values()).filter(Boolean);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Patients</h1>
      <p className="text-gray-600 mb-8">{uniquePatients.length} patients</p>

      {uniquePatients.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No patients yet</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniquePatients.map((patient: any) => (
            <Card key={patient._id} hover>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                  {patient.name?.[0] || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
