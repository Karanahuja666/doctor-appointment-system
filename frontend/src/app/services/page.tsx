'use client';
import { motion } from 'framer-motion';
import { Calendar, Video, FileText, Pill, Ambulance, Shield, Phone, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const services = [
  { icon: <Calendar className="w-8 h-8" />, title: 'Online Booking', desc: 'Book appointments with top doctors in seconds. Choose your preferred date, time, and consultation type.', color: 'from-primary-500 to-cyan-500' },
  { icon: <Video className="w-8 h-8" />, title: 'Video Consultation', desc: 'Connect with doctors from the comfort of your home via secure, HD video calls.', color: 'from-purple-500 to-indigo-500' },
  { icon: <FileText className="w-8 h-8" />, title: 'Digital Prescriptions', desc: 'Receive digital prescriptions and medical reports directly in your account.', color: 'from-green-500 to-emerald-500' },
  { icon: <Pill className="w-8 h-8" />, title: 'Pharmacy Integration', desc: 'Order prescribed medicines online with home delivery from partner pharmacies.', color: 'from-amber-500 to-orange-500' },
  { icon: <Ambulance className="w-8 h-8" />, title: 'Emergency Services', desc: '24/7 emergency support with quick ambulance dispatch and ER coordination.', color: 'from-red-500 to-pink-500' },
  { icon: <Shield className="w-8 h-8" />, title: 'Health Insurance', desc: 'Seamless insurance verification and cashless treatment at partner hospitals.', color: 'from-blue-500 to-cyan-500' },
  { icon: <Phone className="w-8 h-8" />, title: 'SMS Reminders', desc: 'Never miss an appointment with automated SMS and email reminders.', color: 'from-teal-500 to-green-500' },
  { icon: <Clock className="w-8 h-8" />, title: '24/7 Support', desc: 'Round-the-clock customer support for all your healthcare queries.', color: 'from-rose-500 to-red-500' },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 hero-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="gradient-text">Services</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Comprehensive healthcare services designed for your convenience.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
