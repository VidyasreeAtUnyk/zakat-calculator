import { renderHook, waitFor } from '@testing-library/react';
import {
  FALLBACK_GOLD_PRICE_AED,
  TROY_OZ_GRAMS,
  USD_TO_AED,
} from '@/lib/constants';
import { useGoldPrice } from '@/hooks/useGoldPrice';

const mockFetch = jest.fn();
global.fetch = mockFetch;

function expectedAedPerGram(usdPerOz: number): number {
  return (usdPerOz / TROY_OZ_GRAMS) * USD_TO_AED;
}

describe('useGoldPrice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useGoldPrice());
    expect(result.current.loading).toBe(true);
    expect(result.current.isLive).toBe(false);
  });

  it('returns live price when API succeeds', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('gold')) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ price: 1950 }],
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [{ price: 25 }],
      });
    });

    const { result } = renderHook(() => useGoldPrice());

    await jest.advanceTimersByTimeAsync(800);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isLive).toBe(true);
    expect(result.current.goldPriceAED).toBeGreaterThan(0);
    expect(result.current.goldPriceAED).toBeCloseTo(
      expectedAedPerGram(1950),
      0
    );
  });

  it('returns fallback price when API fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useGoldPrice());

    await jest.advanceTimersByTimeAsync(800);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isLive).toBe(false);
    expect(result.current.error).toBe(true);
    expect(result.current.goldPriceAED).toBe(FALLBACK_GOLD_PRICE_AED);
  });

  it('returns fallback when API returns invalid data', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('gold')) {
        return Promise.resolve({ ok: false, status: 429 });
      }
      return Promise.resolve({
        ok: true,
        json: async () => [{ price: 25 }],
      });
    });

    const { result } = renderHook(() => useGoldPrice());

    await jest.advanceTimersByTimeAsync(800);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isLive).toBe(false);
    expect(result.current.goldPriceAED).toBe(FALLBACK_GOLD_PRICE_AED);
  });
});
