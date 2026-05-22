'use client';

import type { InputHTMLAttributes } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: string;
  subtitle?: string;
  prefix?: string;
  error?: string;
  tooltip?: string;
}

export function Input({
  label,
  subtitle,
  prefix = 'AED',
  error,
  tooltip,
  value,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  const hasValue = value !== undefined && value !== '' && value !== 0;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-mal-dark">
          {label}
        </label>
        {tooltip && <Tooltip content={tooltip} />}
      </div>
      {subtitle && <p className="text-xs text-mal-gray">{subtitle}</p>}
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-mal-gray">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          value={value}
          className={`w-full rounded-xl border bg-white py-3 text-mal-dark transition-colors focus:outline-none focus:ring-2 focus:ring-mal-purple ${
            prefix ? 'pl-14 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : hasValue
                ? 'border-mal-purple border-l-4'
                : 'border-mal-border'
          }`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
