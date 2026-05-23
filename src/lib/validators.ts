export const MAX_ASSET_VALUE = 999_999_999;
export const MAX_GRAMS = 100_000;

export function sanitizeNumberInput(value: string): string {
  if (value.trim().startsWith('-')) {
    return '0';
  }
  return value
    .replace(/[^0-9.]/g, '')
    .replace(/^0+(\d)/, '$1')
    .replace(/(\..*)\./g, '$1')
    .replace(/(\.\d{2})\d+/, '$1');
}

export function parseInputValue(value: string): number {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
}

export function clampAssetValue(value: number): number {
  return Math.min(value, MAX_ASSET_VALUE);
}

export function clampGramValue(value: number): number {
  return Math.min(value, MAX_GRAMS);
}

export function isValidAssetValue(value: number): boolean {
  return (
    !isNaN(value) &&
    isFinite(value) &&
    value >= 0 &&
    value <= MAX_ASSET_VALUE
  );
}
