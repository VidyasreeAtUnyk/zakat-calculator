import { formatAED, formatGrams } from '@/lib/formatters';

describe('formatAED', () => {
  it('formats amount with two decimals', () => {
    expect(formatAED(27200)).toBe('AED 27,200.00');
  });

  it('formats zero', () => {
    expect(formatAED(0)).toBe('AED 0.00');
  });
});

describe('formatGrams', () => {
  it('formats grams with g suffix', () => {
    expect(formatGrams(85)).toBe('85g');
  });
});
