'use client';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Globe, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20">
        <section className="hero-gradient py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">About <span className="gradient-text">MediBook</span></h1>
              <p className="text-lg text-gray-600">We are on a mission to make quality healthcare accessible to everyone, everywhere. Our platform connects patients with the best doctors for seamless healthcare experiences.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: <Award className="w-8 h-8" />, title: 'Excellence', desc: 'Committed to highest standards of medical care and service.', color: 'from-primary-500 to-cyan-500' },
                { icon: <Users className="w-8 h-8" />, title: 'Patient-First', desc: 'Every decision we make prioritizes patient well-being.', color: 'from-purple-500 to-indigo-500' },
                { icon: <Heart className="w-8 h-8" />, title: 'Compassion', desc: 'We care deeply about every patient who trusts us.', color: 'from-red-500 to-pink-500' },
                { icon: <Globe className="w-8 h-8" />, title: 'Accessibility', desc: 'Healthcare should be available to everyone, everywhere.', color: 'from-green-500 to-emerald-500' },
              ].map((v, i) => (
                <motion.div key={v.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                  <Card glass hover className="text-center h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mx-auto mb-4`}>
                      {v.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-600">{v.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h2>
                <div className="space-y-4">
                  {[
                    'Board-certified doctors with years of experience',
                    'Easy online booking with real-time availability',
                    'Secure video consultations from home',
                    'Digital prescriptions and health records',
                    'Multiple payment options including insurance',
                    '24/7 customer support',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '200+', label: 'Doctors' },
                  { value: '50K+', label: 'Patients' },
                  { value: '100K+', label: 'Appointments' },
                  { value: '4.9', label: 'Rating' },
                ].map((stat) => (
                  <Card key={stat.label} glass className="text-center">
                    <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
