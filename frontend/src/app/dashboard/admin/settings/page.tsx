'use client';
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    siteName: 'MediBook', tagline: 'Your Health, Our Priority', email: '', phone: '', address: '',
    workingHours: 'Mon-Sat: 8AM - 8PM',
    appointmentSettings: { slotDuration: 30, maxAdvanceBookingDays: 30, cancellationHours: 24, autoConfirm: false },
    paymentSettings: { currency: 'USD', enableStripe: true, enableRazorpay: false, enablePaypal: false, enableCash: true },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try { await api.put('/admin/settings', settings); toast.success('Settings saved!'); }
    catch { toast.error('Failed to save'); }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
        <Button onClick={handleSave} loading={loading}><Save className="w-4 h-4" /> Save</Button>
      </div>

      <div className="space-y-8 max-w-3xl">
        <Card>
          <CardTitle className="mb-4">General</CardTitle>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Site Name" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              <Input label="Tagline" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
              <Input label="Phone" value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <Input label="Address" value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            <Input label="Working Hours" value={settings.workingHours} onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })} />
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Appointment Settings</CardTitle>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Slot Duration (min)" type="number" value={settings.appointmentSettings?.slotDuration} onChange={(e) => setSettings({ ...settings, appointmentSettings: { ...settings.appointmentSettings, slotDuration: parseInt(e.target.value) || 0 } })} />
              <Input label="Max Advance Days" type="number" value={settings.appointmentSettings?.maxAdvanceBookingDays} onChange={(e) => setSettings({ ...settings, appointmentSettings: { ...settings.appointmentSettings, maxAdvanceBookingDays: parseInt(e.target.value) || 0 } })} />
              <Input label="Cancellation Hours" type="number" value={settings.appointmentSettings?.cancellationHours} onChange={(e) => setSettings({ ...settings, appointmentSettings: { ...settings.appointmentSettings, cancellationHours: parseInt(e.target.value) || 0 } })} />
            </div>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.appointmentSettings?.autoConfirm || false}
                onChange={(e) => setSettings({ ...settings, appointmentSettings: { ...settings.appointmentSettings, autoConfirm: e.target.checked } })}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-gray-700">Auto-confirm appointments</span>
            </label>
          </div>
        </Card>

        <Card>
          <CardTitle className="mb-4">Payment Settings</CardTitle>
          <div className="space-y-3">
            <Input label="Currency" value={settings.paymentSettings?.currency} onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, currency: e.target.value } })} />
            {(['Stripe', 'Razorpay', 'PayPal', 'Cash'] as const).map((method) => {
              const key = `enable${method}` as string;
              return (
                <label key={method} className="flex items-center gap-3">
                  <input type="checkbox" checked={settings.paymentSettings?.[key] || false}
                    onChange={(e) => setSettings({ ...settings, paymentSettings: { ...settings.paymentSettings, [key]: e.target.checked } })}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-gray-700">Enable {method}</span>
                </label>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
