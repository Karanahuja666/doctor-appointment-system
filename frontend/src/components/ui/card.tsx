import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  glass?: boolean;
  hover?: boolean;
}

export function Card({ className, children, glass, hover }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm',
        glass && 'bg-white/70 backdrop-blur-xl border-white/20 shadow-glass',
        hover && 'transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn('text-lg font-semibold text-gray-900', className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn(className)}>{children}</div>;
}
