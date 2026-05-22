export function formatAED(amount: number): string {
  const formatted = amount.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `AED ${formatted}`;
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
