import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';
import Link from 'next/link';

type BaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  href?: string;
};

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-cyan-500 text-white hover:from-primary-600 hover:to-cyan-600 shadow-lg shadow-primary-500/25',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-8 py-3 text-base' };

const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, href, ...props }, ref) => {
    const classes = cn(baseClasses, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(props as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>)}
        >
          {loading && <Spinner />}
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={(props as ButtonHTMLAttributes<HTMLButtonElement>).disabled || loading}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
