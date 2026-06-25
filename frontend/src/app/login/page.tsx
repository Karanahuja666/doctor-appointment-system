'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful!');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const path = user.role === 'admin' ? '/dashboard/admin' : user.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';
      router.push(path);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MediBook</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="w-4 h-4" />} required />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="w-4 h-4" />} required />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">Forgot password?</Link>
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">Sign in</Button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            Don&apos;t have an account? <Link href="/register" className="text-primary-600 font-semibold hover:text-primary-700">Sign up</Link>
          </p>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Admin:</strong> admin@medibook.com / password123</p>
              <p><strong>Doctor:</strong> sarah@medibook.com / password123</p>
              <p><strong>Patient:</strong> patient@medibook.com / password123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
