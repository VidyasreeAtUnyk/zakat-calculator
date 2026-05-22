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

describe('formatAED - edge cases', () => {
  it('formats zero correctly', () => {
    expect(formatAED(0)).toBe('AED 0.00');
  });

  it('formats large numbers with commas', () => {
    expect(formatAED(1_000_000)).toBe('AED 1,000,000.00');
  });

  it('formats decimal amounts correctly', () => {
    expect(formatAED(15170.725)).toBe('AED 15,170.73');
  });

  it('formats amounts below 1000', () => {
    expect(formatAED(680)).toBe('AED 680.00');
  });
});

describe('formatGrams - additional', () => {
  it('formats whole grams', () => {
    expect(formatGrams(85)).toBe('85g');
  });

  it('formats decimal grams', () => {
    expect(formatGrams(10.5)).toBe('10.5g');
  });

  it('formats zero grams', () => {
    expect(formatGrams(0)).toBe('0g');
  });
});
