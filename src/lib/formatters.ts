import { MAX_ASSET_VALUE } from '@/lib/validators';

export function formatAED(amount: number): string {
  const formatted = amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `AED ${formatted}`;
}

export function formatAEDSafe(value: unknown): string {
  const num = typeof value === 'number' ? value : parseFloat(String(value));

  if (isNaN(num) || !isFinite(num)) {
    return 'AED 0.00';
  }

  const clamped = Math.min(Math.abs(num), MAX_ASSET_VALUE);

  return `AED ${clamped.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatGrams(grams: number): string {
  return `${grams}g`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
