import { NISAB_GOLD_GRAMS, ZAKAT_RATE } from '@/lib/constants';
import type {
  AssetDetails,
  AssetType,
  GoldAsset,
  Liabilities,
  PropertyAsset,
  SilverAsset,
  ZakatResult,
} from '@/types/zakat.types';

export function calculateGoldValue(asset: GoldAsset): number {
  if (asset.usage === 'worn') {
    return 0;
  }
  return asset.weightGrams * asset.pricePerGram;
}

export function calculateSilverValue(asset: SilverAsset): number {
  return asset.weightGrams * asset.pricePerGram;
}

export function calculatePropertyValue(assets: PropertyAsset[]): number {
  return assets.reduce((total, property) => {
    if (property.type === 'primary') {
      return total;
    }
    if (property.type === 'investment') {
      return total + property.estimatedValue;
    }
    return total + (property.rentalIncomeAnnual ?? 0);
  }, 0);
}

export function calculateNisab(goldPriceAED: number): number {
  return NISAB_GOLD_GRAMS * goldPriceAED;
}

function propertyLineValue(property: PropertyAsset): number {
  if (property.type === 'primary') {
    return 0;
  }
  if (property.type === 'investment') {
    return property.estimatedValue;
  }
  return property.rentalIncomeAnnual ?? 0;
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

  if (assetDetails.cash !== undefined && assetDetails.cash > 0) {
    breakdown.push({
      assetType: 'cash',
      value: assetDetails.cash,
      zakatable: true,
    });
    totalAssets += assetDetails.cash;
  }

  if (assetDetails.gold) {
    const value = calculateGoldValue(assetDetails.gold);
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
    const value = calculateSilverValue(assetDetails.silver);
    breakdown.push({
      assetType: 'silver',
      value,
      zakatable: value > 0,
    });
    totalAssets += value;
  }

  if (
    assetDetails.investments !== undefined &&
    assetDetails.investments > 0
  ) {
    breakdown.push({
      assetType: 'investments',
      value: assetDetails.investments,
      zakatable: true,
    });
    totalAssets += assetDetails.investments;
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

  if (assetDetails.business !== undefined && assetDetails.business > 0) {
    breakdown.push({
      assetType: 'business',
      value: assetDetails.business,
      zakatable: true,
    });
    totalAssets += assetDetails.business;
  }

  if (
    assetDetails.receivables !== undefined &&
    assetDetails.receivables > 0
  ) {
    breakdown.push({
      assetType: 'receivables',
      value: assetDetails.receivables,
      zakatable: true,
    });
    totalAssets += assetDetails.receivables;
  }

  const rawLiabilities =
    liabilities.loans + liabilities.rentDue + liabilities.otherDebts;
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
