'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/departments', label: 'Departments' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loadUser } = useAuth();

  useEffect(() => { loadUser(); }, [loadUser]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-transparent')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className={cn('text-xl font-bold transition-colors', scrolled ? 'text-gray-900' : 'text-gray-900')}>MediBook</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', scrolled ? 'text-gray-600 hover:text-primary-600 hover:bg-primary-50' : 'text-gray-700 hover:text-primary-600 hover:bg-white/50')}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button href={dashboardPath} variant="ghost" size="sm"><LayoutDashboard className="w-4 h-4" /> Dashboard</Button>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Button href="/login" variant="ghost" size="sm">Log in</Button>
                <Button href="/register" size="sm">Get Started</Button>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="block px-4 py-2.5 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 font-medium">
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                {user ? (
                  <>
                    <Button href={dashboardPath} className="w-full" size="sm" onClick={() => setIsOpen(false)}>Dashboard</Button>
                    <Button variant="outline" className="w-full" size="sm" onClick={() => { logout(); setIsOpen(false); }}>Logout</Button>
                  </>
                ) : (
                  <>
                    <Button href="/login" variant="outline" className="w-full" size="sm" onClick={() => setIsOpen(false)}>Log in</Button>
                    <Button href="/register" className="w-full" size="sm" onClick={() => setIsOpen(false)}>Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
