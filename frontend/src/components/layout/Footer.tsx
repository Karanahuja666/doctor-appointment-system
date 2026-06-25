import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-white">MediBook</span>
            </div>
            <p className="text-sm leading-relaxed">Your trusted platform for booking doctor appointments. Quality healthcare made accessible and convenient.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {['Doctors', 'Departments', 'Services', 'About', 'Contact'].map((link) => (
                <li key={link}><Link href={`/${link.toLowerCase()}`} className="hover:text-primary-400 transition-colors">{link}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {['Online Consultation', 'Video Call', 'Lab Reports', 'Pharmacy', 'Emergency'].map((s) => (
                <li key={s} className="text-gray-400">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-400" /> 123 Medical Center, NY 10001</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary-400" /> +1 (555) 123-4567</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary-400" /> support@medibook.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} MediBook. All rights reserved.</p>
          <p className="text-sm flex items-center gap-1">Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for better healthcare</p>
        </div>
      </div>
    </footer>
  );
}
