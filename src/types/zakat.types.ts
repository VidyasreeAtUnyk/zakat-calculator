export type AssetType =
  | 'cash'
  | 'gold'
  | 'silver'
  | 'investments'
  | 'property'
  | 'business'
  | 'receivables';

export type GoldUsage = 'worn' | 'stored';

export type PropertyType = 'primary' | 'investment' | 'rental';

export interface GoldAsset {
  usage: GoldUsage;
  weightGrams: number;
  pricePerGram: number;
}

export interface SilverAsset {
  weightGrams: number;
  pricePerGram: number;
}

export interface PropertyAsset {
  type: PropertyType;
  estimatedValue: number;
  rentalIncomeAnnual?: number;
}

export type ReceivablesRepayable = 'yes' | 'uncertain';

export interface AssetDetails {
  cash?: number;
  gold?: GoldAsset;
  silver?: SilverAsset;
  investments?: number;
  property?: PropertyAsset[];
  business?: number;
  receivables?: number;
  receivablesRepayable?: ReceivablesRepayable;
}

export interface Liabilities {
  loans: number;
  rentDue: number;
  otherDebts: number;
}

export interface ZakatResult {
  totalAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  nisabThreshold: number;
  isEligible: boolean;
  zakatDue: number;
  breakdown: {
    assetType: AssetType | string;
    value: number;
    zakatable: boolean;
    reason?: string;
  }[];
}

export interface WizardState {
  step: number;
  selectedAssets: AssetType[];
  assetDetails: AssetDetails;
  liabilities: Liabilities;
  result: ZakatResult | null;
  goldPriceAED: number;
  silverPriceAED: number;
  goldPriceLoading: boolean;
  goldPriceError: boolean;
}
