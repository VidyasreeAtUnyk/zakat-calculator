import type { AssetType } from '@/types/zakat.types';

export const NISAB_GOLD_GRAMS = 85;
export const NISAB_SILVER_GRAMS = 595;
export const ZAKAT_RATE = 0.025;
export const FALLBACK_GOLD_PRICE_AED = 320;
export const FALLBACK_SILVER_PRICE_AED = 3.8;

export const USD_TO_AED = 3.67;
export const TROY_OZ_GRAMS = 31.1035;

export const ASSET_CONFIG: Record<
  AssetType,
  {
    label: string;
    subtitle: string;
    icon: string;
    alwaysZakatable: boolean;
  }
> = {
  cash: {
    label: 'Cash & Savings',
    subtitle: 'Bank accounts, cash at home, fixed deposits',
    icon: '💰',
    alwaysZakatable: true,
  },
  gold: {
    label: 'Gold',
    subtitle: 'Jewellery, coins, bars',
    icon: '🥇',
    alwaysZakatable: false,
  },
  silver: {
    label: 'Silver',
    subtitle: 'Coins, bars, jewellery',
    icon: '🥈',
    alwaysZakatable: true,
  },
  investments: {
    label: 'Investments & Stocks',
    subtitle: 'Shares, funds, crypto, bonds',
    icon: '📈',
    alwaysZakatable: true,
  },
  property: {
    label: 'Property',
    subtitle: 'Real estate you own',
    icon: '🏠',
    alwaysZakatable: false,
  },
  business: {
    label: 'Business Assets',
    subtitle: 'Inventory, trading stock, receivables',
    icon: '🏪',
    alwaysZakatable: true,
  },
  receivables: {
    label: 'Money Owed To You',
    subtitle: 'Loans given, deposits, pending payments',
    icon: '💸',
    alwaysZakatable: true,
  },
};

export const WIZARD_STEPS = [
  'Welcome',
  'Assets',
  'Details',
  'Debts',
  'Result',
] as const;

export const ASSET_ORDER: AssetType[] = [
  'cash',
  'gold',
  'silver',
  'investments',
  'property',
  'business',
  'receivables',
];
