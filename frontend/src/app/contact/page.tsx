'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 hero-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact <span className="gradient-text">Us</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Have questions? We&apos;d love to hear from you.</p>
          </motion.div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              {[
                { icon: <MapPin className="w-6 h-6" />, title: 'Address', detail: '123 Medical Center Drive, New York, NY 10001', color: 'from-primary-500 to-cyan-500' },
                { icon: <Phone className="w-6 h-6" />, title: 'Phone', detail: '+1 (555) 123-4567', color: 'from-green-500 to-emerald-500' },
                { icon: <Mail className="w-6 h-6" />, title: 'Email', detail: 'support@medibook.com', color: 'from-purple-500 to-indigo-500' },
                { icon: <Clock className="w-6 h-6" />, title: 'Working Hours', detail: 'Mon-Sat: 8:00 AM - 8:00 PM', color: 'from-amber-500 to-orange-500' },
              ].map((item) => (
                <Card key={item.title} glass hover>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.detail}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-2">
              <Card glass className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Name" placeholder="John Doe" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                    <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                    <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={(e) => update('subject', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                    <textarea rows={5} placeholder="Tell us more..." value={form.message} onChange={(e) => update('message', e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none" required />
                  </div>
                  <Button type="submit" loading={loading} size="lg"><Send className="w-4 h-4" /> Send Message</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
