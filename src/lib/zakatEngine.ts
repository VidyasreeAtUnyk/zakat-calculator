import { NISAB_GOLD_GRAMS, ZAKAT_RATE } from '@/lib/constants';
import { MAX_ASSET_VALUE } from '@/lib/validators';
import type {
  AssetDetails,
  AssetType,
  GoldAsset,
  Liabilities,
  PropertyAsset,
  SilverAsset,
  ZakatResult,
} from '@/types/zakat.types';

function safeNumber(value: unknown): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return 0;
  }
  return Math.min(num, MAX_ASSET_VALUE);
}

export function calculateGoldValue(asset: GoldAsset): number {
  if (asset.usage === 'worn') {
    return 0;
  }
  return safeNumber(asset.weightGrams) * safeNumber(asset.pricePerGram);
}

export function calculateSilverValue(asset: SilverAsset): number {
  return safeNumber(asset.weightGrams) * safeNumber(asset.pricePerGram);
}

export function calculatePropertyValue(assets: PropertyAsset[]): number {
  return assets.reduce((total, property) => {
    if (property.type === 'primary') {
      return total;
    }
    if (property.type === 'investment') {
      return total + safeNumber(property.estimatedValue);
    }
    return total + safeNumber(property.rentalIncomeAnnual ?? 0);
  }, 0);
}

export function calculateNisab(goldPriceAED: number): number {
  return NISAB_GOLD_GRAMS * safeNumber(goldPriceAED);
}

function propertyLineValue(property: PropertyAsset): number {
  if (property.type === 'primary') {
    return 0;
  }
  if (property.type === 'investment') {
    return safeNumber(property.estimatedValue);
  }
  return safeNumber(property.rentalIncomeAnnual ?? 0);
}

function propertyReason(property: PropertyAsset): string | undefined {
  if (property.type === 'primary') {
    return 'Primary residence is not zakatable';
  }
  if (property.type === 'rental') {
    return 'Only annual rental income is zakatable';
  }
  return undefined;
}

export function calculateZakat(
  assetDetails: AssetDetails,
  liabilities: Liabilities,
  goldPriceAED: number
): ZakatResult {
  const breakdown: ZakatResult['breakdown'] = [];
  let totalAssets = 0;

  const cash = safeNumber(assetDetails.cash);
  if (cash > 0) {
    breakdown.push({
      assetType: 'cash',
      value: cash,
      zakatable: true,
    });
    totalAssets += cash;
  }

  if (assetDetails.gold) {
    const gold = {
      ...assetDetails.gold,
      weightGrams: safeNumber(assetDetails.gold.weightGrams),
      pricePerGram: safeNumber(assetDetails.gold.pricePerGram),
    };
    const value = calculateGoldValue(gold);
    const zakatable = value > 0;
    breakdown.push({
      assetType: 'gold',
      value,
      zakatable,
      reason: zakatable
        ? undefined
        : 'Worn gold is generally exempt from Zakat',
    });
    totalAssets += value;
  }

  if (assetDetails.silver) {
    const silver = {
      ...assetDetails.silver,
      weightGrams: safeNumber(assetDetails.silver.weightGrams),
      pricePerGram: safeNumber(assetDetails.silver.pricePerGram),
    };
    const value = calculateSilverValue(silver);
    breakdown.push({
      assetType: 'silver',
      value,
      zakatable: value > 0,
    });
    totalAssets += value;
  }

  const investments = safeNumber(assetDetails.investments);
  if (investments > 0) {
    breakdown.push({
      assetType: 'investments',
      value: investments,
      zakatable: true,
    });
    totalAssets += investments;
  }

  if (assetDetails.property?.length) {
    assetDetails.property.forEach((property, index) => {
      const value = propertyLineValue(property);
      const zakatable = value > 0;
      breakdown.push({
        assetType: `property-${index + 1}` as AssetType | string,
        value,
        zakatable,
        reason: propertyReason(property),
      });
      totalAssets += value;
    });
  }

  const business = safeNumber(assetDetails.business);
  if (business > 0) {
    breakdown.push({
      assetType: 'business',
      value: business,
      zakatable: true,
    });
    totalAssets += business;
  }

  const receivables = safeNumber(assetDetails.receivables);
  const receivablesExcluded =
    assetDetails.receivablesRepayable === 'uncertain';
  if (receivables > 0 && !receivablesExcluded) {
    breakdown.push({
      assetType: 'receivables',
      value: receivables,
      zakatable: true,
    });
    totalAssets += receivables;
  } else if (receivables > 0 && receivablesExcluded) {
    breakdown.push({
      assetType: 'receivables',
      value: receivables,
      zakatable: false,
      reason: 'Uncertain receivables are excluded from Zakat',
    });
  }

  const rawLiabilities =
    safeNumber(liabilities.loans) +
    safeNumber(liabilities.rentDue) +
    safeNumber(liabilities.otherDebts);
  const totalLiabilities = Math.min(rawLiabilities, totalAssets);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);
  const nisabThreshold = calculateNisab(goldPriceAED);
  const isEligible = netZakatableWealth >= nisabThreshold;
  const zakatDue = isEligible ? netZakatableWealth * ZAKAT_RATE : 0;

  return {
    totalAssets,
    totalLiabilities,
    netZakatableWealth,
    nisabThreshold,
    isEligible,
    zakatDue,
    breakdown,
  };
}
