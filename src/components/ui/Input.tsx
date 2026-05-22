'use client';

import { useState, type ChangeEvent, type ClipboardEvent, type InputHTMLAttributes } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  MAX_ASSET_VALUE,
  MAX_GRAMS,
  clampAssetValue,
  clampGramValue,
  parseInputValue,
  sanitizeNumberInput,
} from '@/lib/validators';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'type'> {
  label: string;
  subtitle?: string;
  prefix?: string;
  error?: string;
  tooltip?: string;
  maxValue?: number;
  isGrams?: boolean;
}

export function Input({
  label,
  subtitle,
  prefix = 'AED',
  error,
  tooltip,
  maxValue = MAX_ASSET_VALUE,
  isGrams = false,
  value,
  className = '',
  id,
  onChange,
  ...props
}: InputProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  const hasValue = value !== undefined && value !== '' && value !== 0;
  const [localError, setLocalError] = useState<string | null>(null);
  const limit = isGrams ? MAX_GRAMS : maxValue;
  const displayError = error ?? localError ?? undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNumberInput(e.target.value);
    const parsed = parseInputValue(sanitized);

    if (parsed > limit) {
      setLocalError(
        `Maximum value is ${isGrams ? '100,000g' : 'AED 999,999,999'}`
      );
    } else {
      setLocalError(null);
    }

    onChange?.({
      ...e,
      target: { ...e.target, value: sanitized },
    } as ChangeEvent<HTMLInputElement>);
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9.]/g, '');
    const parsed = parseInputValue(pasted);
    const clamped = isGrams ? clampGramValue(parsed) : clampAssetValue(parsed);
    const sanitized = sanitizeNumberInput(clamped.toString());

    if (parsed > limit) {
      setLocalError(
        `Maximum value is ${isGrams ? '100,000g' : 'AED 999,999,999'}`
      );
    } else {
      setLocalError(null);
    }

    onChange?.({
      ...e,
      target: {
        ...(e.target as HTMLInputElement),
        value: sanitized,
      },
    } as ChangeEvent<HTMLInputElement>);
  };

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
          type="text"
          inputMode="decimal"
          pattern="[0-9]*\\.?[0-9]{0,2}"
          maxLength={12}
          autoComplete="off"
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          className={`w-full rounded-xl border bg-white py-3 text-mal-dark transition-colors focus:outline-none focus:ring-2 focus:ring-mal-purple ${
            prefix ? 'pl-14 pr-4' : 'px-4'
          } ${
            displayError
              ? 'border-red-500 focus:ring-red-500'
              : hasValue
                ? 'border-mal-purple border-l-4'
                : 'border-mal-border'
          }`}
          {...props}
        />
      </div>
      {displayError && <p className="text-xs text-red-600">{displayError}</p>}
    </div>
  );
}
