import type { ReactNode } from 'react';

export interface BadgeProps {
  variant?: 'live' | 'estimated' | 'success' | 'warning' | 'neutral';
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  live: 'bg-mal-success-light text-mal-success',
  estimated: 'bg-mal-warning-light text-mal-warning',
  success: 'bg-mal-success-light text-mal-success',
  warning: 'bg-mal-warning-light text-mal-warning',
  neutral: 'bg-mal-gray-light text-mal-gray-dark',
};

export function Badge({
  variant = 'neutral',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
