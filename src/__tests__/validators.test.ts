import {
  MAX_ASSET_VALUE,
  clampAssetValue,
  clampGramValue,
  isValidAssetValue,
  parseInputValue,
  sanitizeNumberInput,
} from '@/lib/validators';

describe('sanitizeNumberInput', () => {
  it('removes non-numeric characters', () => {
    expect(sanitizeNumberInput('abc123')).toBe('123');
  });

  it('removes commas from pasted values', () => {
    expect(sanitizeNumberInput('1,000,000')).toBe('1000000');
  });

  it('allows decimal point', () => {
    expect(sanitizeNumberInput('123.45')).toBe('123.45');
  });

  it('removes multiple decimal points', () => {
    expect(sanitizeNumberInput('1.2.3')).toBe('1.23');
  });

  it('limits to 2 decimal places', () => {
    expect(sanitizeNumberInput('1.999')).toBe('1.99');
  });

  it('removes leading zeros', () => {
    expect(sanitizeNumberInput('00100')).toBe('100');
  });

  it('handles empty string', () => {
    expect(sanitizeNumberInput('')).toBe('');
  });

  it('handles scientific notation input', () => {
    expect(sanitizeNumberInput('1e10')).toBe('110');
  });
});

describe('parseInputValue', () => {
  it('returns 0 for NaN', () => {
    expect(parseInputValue('abc')).toBe(0);
  });

  it('returns 0 for negative', () => {
    expect(parseInputValue('-50')).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parseInputValue('')).toBe(0);
  });

  it('parses valid decimal', () => {
    expect(parseInputValue('123.45')).toBe(123.45);
  });
});

describe('clampAssetValue', () => {
  it('returns value when below max', () => {
    expect(clampAssetValue(500_000)).toBe(500_000);
  });

  it('returns MAX when above max', () => {
    expect(clampAssetValue(1_000_000_000)).toBe(MAX_ASSET_VALUE);
  });

  it('handles exactly at max', () => {
    expect(clampAssetValue(MAX_ASSET_VALUE)).toBe(MAX_ASSET_VALUE);
  });
});

describe('clampGramValue', () => {
  it('returns value when below max grams', () => {
    expect(clampGramValue(50)).toBe(50);
  });

  it('returns MAX_GRAMS when above max', () => {
    expect(clampGramValue(200_000)).toBe(100_000);
  });
});

describe('isValidAssetValue', () => {
  it('returns false for NaN', () => {
    expect(isValidAssetValue(NaN)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isValidAssetValue(Infinity)).toBe(false);
  });

  it('returns false for negative', () => {
    expect(isValidAssetValue(-1)).toBe(false);
  });

  it('returns false above MAX', () => {
    expect(isValidAssetValue(MAX_ASSET_VALUE + 1)).toBe(false);
  });

  it('returns true for valid value', () => {
    expect(isValidAssetValue(50_000)).toBe(true);
  });
});
