'use client';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Clock, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatCurrency, getInitials } from '@/lib/utils';
import type { Doctor } from '@/types';

const specializations = ['All', 'Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Dermatologist', 'Pediatrician', 'Ophthalmologist'];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const fetchDoctors = async () => {
        try {
          const params: Record<string, string> = {};
          if (search) params.search = search;
          if (selectedSpec !== 'All') params.specialization = selectedSpec;
          const { data } = await api.get('/doctors', { params });
          setDoctors(data.data);
        } catch { /* empty */ }
        setLoading(false);
      };
      fetchDoctors();
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedSpec]);

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-20 hero-gradient min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your <span className="gradient-text">Doctor</span></h1>
            <p className="text-gray-600 max-w-2xl mx-auto">Browse our verified doctors and book your appointment today.</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input placeholder="Search by name or specialization..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search className="w-4 h-4" />} />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {specializations.map((spec) => (
              <button key={spec} onClick={() => setSelectedSpec(spec)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSpec === spec ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-primary-50'}`}>
                {spec}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                    <div className="flex-1"><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No doctors found. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor, i) => (
                <motion.div key={doctor._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card hover className="h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                        {getInitials(doctor.user?.name || 'DR')}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{doctor.user?.name}</h3>
                        <p className="text-sm text-primary-600 font-medium">{doctor.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-medium text-gray-700">{doctor.rating?.toFixed(1)}</span>
                          <span className="text-xs text-gray-400">({doctor.totalReviews} reviews)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <p className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {doctor.experience} years experience</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {doctor.department?.name || 'General'}</p>
                      {doctor.consultationType?.includes('video') && (
                        <Badge variant="primary"><Video className="w-3 h-3 mr-1" /> Video Consult Available</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                        <p className="text-lg font-bold gradient-text">{formatCurrency(doctor.fees)}</p>
                      </div>
                      <Button href={`/appointments?doctor=${doctor._id}`} size="sm">Book Now <ArrowRight className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
