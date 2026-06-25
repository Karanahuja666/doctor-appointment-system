'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Bone, Eye, Baby, Activity, Stethoscope, Pill } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';

const iconMap: Record<string, React.ReactNode> = {
  Cardiology: <Heart className="w-8 h-8" />,
  Neurology: <Brain className="w-8 h-8" />,
  Orthopedics: <Bone className="w-8 h-8" />,
  Ophthalmology: <Eye className="w-8 h-8" />,
  Pediatrics: <Baby className="w-8 h-8" />,
  Dermatology: <Stethoscope className="w-8 h-8" />,
  Dentistry: <Pill className="w-8 h-8" />,
  'General Medicine': <Activity className="w-8 h-8" />,
};

const colors = ['from-red-500 to-pink-500', 'from-purple-500 to-indigo-500', 'from-amber-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-primary-500 to-cyan-500', 'from-rose-500 to-red-500', 'from-teal-500 to-green-500'];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/departments').then(({ data }) => setDepartments(data.data)).catch(() => setDepartments([]));
  }, []);

  const depts = departments.length ? departments : [
    { _id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system specialists providing comprehensive cardiac care.' },
    { _id: '2', name: 'Neurology', description: 'Brain and nervous system specialists for neurological conditions.' },
    { _id: '3', name: 'Orthopedics', description: 'Bone, joint, and muscle specialists for musculoskeletal conditions.' },
    { _id: '4', name: 'Ophthalmology', description: 'Eye care specialists providing comprehensive vision care.' },
    { _id: '5', name: 'Pediatrics', description: 'Child healthcare specialists ensuring healthy growth and development.' },
    { _id: '6', name: 'Dermatology', description: 'Skin care and treatment specialists for all skin conditions.' },
    { _id: '7', name: 'Dentistry', description: 'Dental and oral health specialists for comprehensive dental care.' },
    { _id: '8', name: 'General Medicine', description: 'General health and wellness care for all age groups.' },
  ];

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 hero-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our <span className="gradient-text">Departments</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">World-class medical departments staffed by experienced specialists.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {depts.map((dept, i) => (
              <motion.div key={dept._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card hover className="text-center h-full">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center text-white mx-auto mb-4`}>
                    {iconMap[dept.name] || <Activity className="w-8 h-8" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{dept.name}</h3>
                  <p className="text-sm text-gray-600">{dept.description}</p>
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
