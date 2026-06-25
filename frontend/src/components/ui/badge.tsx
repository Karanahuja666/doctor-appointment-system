import { cn } from '@/lib/utils';

const variants: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant] || variants.default, className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: string; label: string }> = {
    pending: { variant: 'warning', label: 'Pending' },
    confirmed: { variant: 'primary', label: 'Confirmed' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    rescheduled: { variant: 'info', label: 'Rescheduled' },
  };
  const { variant, label } = map[status] || { variant: 'default', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}
