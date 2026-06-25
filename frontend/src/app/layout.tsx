import type { Metadata } from 'next';
import Providers from '@/components/shared/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'MediBook - Doctor Appointment Management System',
  description: 'Book appointments with top doctors. Quality healthcare made accessible and convenient.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
