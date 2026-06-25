'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Shield, Video, Clock, Star, Users, ArrowRight, CheckCircle2, Stethoscope, Heart, Brain, Bone, Eye, Baby, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

const stats = [
  { value: '200+', label: 'Expert Doctors' },
  { value: '50K+', label: 'Happy Patients' },
  { value: '30+', label: 'Specializations' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  { icon: <Calendar className="w-6 h-6" />, title: 'Easy Booking', desc: 'Book appointments in seconds with our intuitive scheduling system.' },
  { icon: <Video className="w-6 h-6" />, title: 'Video Consultation', desc: 'Connect with doctors from home via secure video calls.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Secure & Private', desc: 'Your health data is protected with enterprise-grade security.' },
  { icon: <Clock className="w-6 h-6" />, title: 'Real-time Updates', desc: 'Get instant notifications about your appointments and reports.' },
];

const departments = [
  { icon: <Heart className="w-8 h-8" />, name: 'Cardiology', color: 'from-red-500 to-pink-500' },
  { icon: <Brain className="w-8 h-8" />, name: 'Neurology', color: 'from-purple-500 to-indigo-500' },
  { icon: <Bone className="w-8 h-8" />, name: 'Orthopedics', color: 'from-amber-500 to-orange-500' },
  { icon: <Eye className="w-8 h-8" />, name: 'Ophthalmology', color: 'from-blue-500 to-cyan-500' },
  { icon: <Baby className="w-8 h-8" />, name: 'Pediatrics', color: 'from-green-500 to-emerald-500' },
  { icon: <Activity className="w-8 h-8" />, name: 'General Medicine', color: 'from-primary-500 to-cyan-500' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="hero-gradient min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6">
                <Stethoscope className="w-4 h-4" /> #1 Healthcare Platform
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Your Health,{' '}
                <span className="gradient-text">Our Priority</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Book appointments with top doctors, get video consultations, and manage your health — all in one platform.
              </p>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button href="/doctors" size="lg">Find a Doctor <ArrowRight className="w-5 h-5" /></Button>
                <Button href="/register" variant="outline" size="lg">Create Account</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-cyan-400/20 rounded-3xl" />
                <div className="absolute top-8 left-8 right-8 bottom-8 glass-card p-8 flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mb-6">
                    <Stethoscope className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Healthcare</h3>
                  <p className="text-gray-600 text-center">Connecting patients with the best doctors worldwide</p>
                  <div className="mt-6 flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">4.9 out of 5 based on 10,000+ reviews</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose <span className="gradient-text">MediBook</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience healthcare reimagined with cutting-edge technology and compassionate care.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card glass hover className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our <span className="gradient-text">Departments</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Specialized care across multiple medical disciplines.</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {departments.map((dept, i) => (
              <motion.div key={dept.name} {...fadeUp} transition={{ delay: i * 0.05 }}>
                <Link href="/departments">
                  <Card hover className="text-center cursor-pointer">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-white mx-auto mb-3`}>
                      {dept.icon}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{dept.name}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It <span className="gradient-text">Works</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Search Doctor', desc: 'Browse through our verified doctors by specialization, location, or name.' },
              { step: '02', title: 'Book Appointment', desc: 'Choose a convenient time slot and book your appointment instantly.' },
              { step: '03', title: 'Get Consultation', desc: 'Visit the doctor in person or connect via video call from home.' },
            ].map((item, i) => (
              <motion.div key={item.step} {...fadeUp} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="bg-gradient-to-r from-primary-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 mb-8 max-w-lg mx-auto">Join thousands of patients who trust MediBook for their healthcare needs.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button href="/register" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-none">Create Free Account</Button>
              <Button href="/doctors" size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Browse Doctors</Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
}
