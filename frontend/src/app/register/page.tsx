'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Registration successful!');
      router.push(form.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MediBook</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="text-gray-600 mt-1">Start your healthcare journey</p>
        </div>

        <div className="glass-card p-8">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
            {['patient', 'doctor'].map((role) => (
              <button key={role} onClick={() => update('role', role)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${form.role === role ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500'}`}>
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} icon={<User className="w-4 h-4" />} required />
            <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <Input label="Phone" type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} icon={<Phone className="w-4 h-4" />} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => update('password', e.target.value)} icon={<Lock className="w-4 h-4" />} required />
            <Input label="Confirm Password" type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} icon={<Lock className="w-4 h-4" />} required />
            <Button type="submit" loading={loading} className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
