'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  FALLBACK_GOLD_PRICE_AED,
  FALLBACK_SILVER_PRICE_AED,
  TROY_OZ_GRAMS,
  USD_TO_AED,
} from '@/lib/constants';
import { formatDate } from '@/lib/formatters';

interface SpotResponse {
  price?: number;
  [key: string]: unknown;
}

function usdPerOzToAedPerGram(priceUSD: number): number {
  return (priceUSD / TROY_OZ_GRAMS) * USD_TO_AED;
}

async function fetchSpotPrice(url: string): Promise<number | null> {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  const data: SpotResponse | SpotResponse[] = await response.json();
  if (Array.isArray(data)) {
    const first = data[0];
    return typeof first?.price === 'number' ? first.price : null;
  }
  return typeof data.price === 'number' ? data.price : null;
}

export interface GoldPriceState {
  goldPriceAED: number;
  silverPriceAED: number;
  loading: boolean;
  error: boolean;
  isLive: boolean;
  lastUpdated: string;
  refetch: () => void;
}

export function useGoldPrice(): GoldPriceState {
  const [goldPriceAED, setGoldPriceAED] = useState(FALLBACK_GOLD_PRICE_AED);
  const [silverPriceAED, setSilverPriceAED] = useState(
    FALLBACK_SILVER_PRICE_AED
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(formatDate(new Date()));

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const [goldUsd, silverUsd] = await Promise.all([
        fetchSpotPrice('https://api.gold-api.com/price/XAU'),
        fetchSpotPrice('https://api.gold-api.com/price/XAG'),
      ]);

      if (goldUsd === null) {
        throw new Error('Gold price unavailable');
      }

      setGoldPriceAED(usdPerOzToAedPerGram(goldUsd));
      setSilverPriceAED(
        silverUsd !== null
          ? usdPerOzToAedPerGram(silverUsd)
          : FALLBACK_SILVER_PRICE_AED
      );
      setIsLive(true);
      setLastUpdated(formatDate(new Date()));
    } catch {
      setGoldPriceAED(FALLBACK_GOLD_PRICE_AED);
      setSilverPriceAED(FALLBACK_SILVER_PRICE_AED);
      setError(true);
      setIsLive(false);
      setLastUpdated(formatDate(new Date()));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPrices();
  }, [fetchPrices]);

  return {
    goldPriceAED,
    silverPriceAED,
    loading,
    error,
    isLive,
    lastUpdated,
    refetch: fetchPrices,
  };
}
