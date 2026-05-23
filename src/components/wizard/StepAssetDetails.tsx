'use client';

import { useMemo, useState } from 'react';
import { ASSET_CONFIG } from '@/lib/constants';
import { formatAEDSafe } from '@/lib/formatters';
import { parseInputValue } from '@/lib/validators';
import { calculateGoldValue, calculateSilverValue } from '@/lib/zakatEngine';
import type {
  AssetDetails,
  AssetType,
  GoldUsage,
  PropertyAsset,
  PropertyType,
} from '@/types/zakat.types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export interface StepAssetDetailsProps {
  currentAsset: AssetType;
  subStepIndex: number;
  totalSubSteps: number;
  assetDetails: AssetDetails;
  goldPriceAED: number;
  silverPriceAED: number;
  isLivePrice: boolean;
  onUpdateAssetDetails: (updates: Partial<AssetDetails>) => void;
  onNext: () => void;
  onBack: () => void;
}

function parseAmount(value: string): number {
  return parseInputValue(value);
}

const defaultProperty: PropertyAsset = {
  type: 'primary',
  estimatedValue: 0,
  rentalIncomeAnnual: 0,
};

export function StepAssetDetails({
  currentAsset,
  subStepIndex,
  totalSubSteps,
  assetDetails,
  goldPriceAED,
  silverPriceAED,
  isLivePrice,
  onUpdateAssetDetails,
  onNext,
  onBack,
}: StepAssetDetailsProps) {
  const config = ASSET_CONFIG[currentAsset];
  const [receivableRepayable, setReceivableRepayable] = useState<
    'yes' | 'uncertain'
  >(assetDetails.receivablesRepayable ?? 'yes');
  const [businessInventory, setBusinessInventory] = useState('');
  const [businessReceivables, setBusinessReceivables] = useState('');

  const goldEstimated = useMemo(() => {
    if (!assetDetails.gold || assetDetails.gold.usage !== 'stored') {
      return 0;
    }
    return calculateGoldValue(assetDetails.gold);
  }, [assetDetails.gold]);

  const silverEstimated = useMemo(() => {
    if (!assetDetails.silver) {
      return 0;
    }
    return calculateSilverValue(assetDetails.silver);
  }, [assetDetails.silver]);

  const properties = assetDetails.property ?? [defaultProperty];

  const updateProperty = (index: number, updates: Partial<PropertyAsset>) => {
    const next = [...properties];
    next[index] = { ...next[index], ...updates };
    onUpdateAssetDetails({ property: next });
  };

  const addProperty = () => {
    onUpdateAssetDetails({
      property: [...properties, { ...defaultProperty }],
    });
  };

  const renderGold = () => {
    const gold = assetDetails.gold ?? {
      usage: 'stored' as GoldUsage,
      weightGrams: 0,
      pricePerGram: goldPriceAED,
    };

    return (
      <div className="space-y-4">
        <p className="font-medium text-mal-dark">
          How do you primarily use this gold?
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                value: 'worn' as GoldUsage,
                title: 'I wear it regularly',
                desc: 'Rings, necklaces, daily jewellery',
              },
              {
                value: 'stored' as GoldUsage,
                title: "It's stored or held as investment",
                desc: 'Bars, coins, unworn jewellery',
              },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onUpdateAssetDetails({
                  gold: { ...gold, usage: option.value, pricePerGram: goldPriceAED },
                })
              }
              className={`rounded-3xl border-2 p-4 text-left ${
                gold.usage === option.value
                  ? 'border-mal-purple bg-mal-purple-light'
                  : 'border-mal-border'
              }`}
            >
              <p className="text-sm font-semibold">{option.title}</p>
              <p className="mt-1 text-xs text-mal-gray-dark">{option.desc}</p>
            </button>
          ))}
        </div>

        {gold.usage === 'worn' && (
          <Card className="bg-mal-purple-light/50">
            <p className="text-sm text-mal-dark">
              Worn gold is generally exempt from Zakat according to most
              scholars. Enter weight for reference only.
            </p>
          </Card>
        )}

        <Input
          label="Weight in grams"
          isGrams
          value={gold.weightGrams || ''}
          prefix=""
          onChange={(e) =>
            onUpdateAssetDetails({
              gold: {
                ...gold,
                weightGrams: parseAmount(e.target.value),
                pricePerGram: goldPriceAED,
              },
            })
          }
        />

        {gold.usage === 'stored' && (
          <>
            <div className="flex items-center gap-2 text-sm">
              <span>
                Live gold price: {formatAEDSafe(goldPriceAED)}/gram
              </span>
              <Badge variant={isLivePrice ? 'live' : 'estimated'}>
                {isLivePrice ? 'Live price' : 'Estimated price'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-mal-purple">
              Estimated value: {formatAEDSafe(goldEstimated)}
            </p>
          </>
        )}
      </div>
    );
  };

  const renderProperty = () => (
    <div className="space-y-6">
      {properties.map((property, index) => (
        <Card key={`property-${index}`}>
          <p className="mb-3 font-medium">Property {index + 1}</p>
          <p className="mb-2 text-sm text-mal-gray-dark">
            What type of property is this?
          </p>
          <div className="mb-4 grid gap-2">
            {(
              [
                { value: 'primary' as PropertyType, label: 'My primary home' },
                {
                  value: 'investment' as PropertyType,
                  label: 'Investment property (bought to sell)',
                },
                {
                  value: 'rental' as PropertyType,
                  label: 'Rental property (generating income)',
                },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-mal-border p-3"
              >
                <input
                  type="radio"
                  name={`property-type-${index}`}
                  checked={property.type === opt.value}
                  onChange={() => updateProperty(index, { type: opt.value })}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>

          {property.type === 'primary' && (
            <p className="text-sm text-mal-gray-dark">
              Primary residence is excluded from Zakat.
            </p>
          )}
          {property.type === 'investment' && (
            <Input
              label="Approximate market value"
              value={property.estimatedValue || ''}
              onChange={(e) =>
                updateProperty(index, {
                  estimatedValue: parseAmount(e.target.value),
                })
              }
            />
          )}
          {property.type === 'rental' && (
            <Input
              label="Annual rental income"
              subtitle="Only income is zakatable, not property value"
              value={property.rentalIncomeAnnual || ''}
              onChange={(e) =>
                updateProperty(index, {
                  rentalIncomeAnnual: parseAmount(e.target.value),
                })
              }
            />
          )}
        </Card>
      ))}
      <Button variant="secondary" onClick={addProperty}>
        + Add another property
      </Button>
    </div>
  );

  const renderBusiness = () => (
    <div className="space-y-4">
      <Input
        label="Value of trading inventory and stock"
        tooltip="Fixed assets like equipment and machinery are not zakatable"
        value={businessInventory}
        onChange={(e) => {
          setBusinessInventory(e.target.value);
          const inv = parseAmount(e.target.value);
          const rec = parseAmount(businessReceivables);
          onUpdateAssetDetails({ business: inv + rec });
        }}
      />
      <Input
        label="Outstanding business receivables"
        value={businessReceivables}
        onChange={(e) => {
          setBusinessReceivables(e.target.value);
          const inv = parseAmount(businessInventory);
          const rec = parseAmount(e.target.value);
          onUpdateAssetDetails({ business: inv + rec });
        }}
      />
    </div>
  );

  const renderContent = () => {
    switch (currentAsset) {
      case 'cash':
        return (
          <Input
            label="Total balance across all accounts"
            subtitle="Include current accounts, savings accounts, fixed deposits, and cash at home"
            tooltip="Foreign currency? Convert to AED at today's rate"
            value={assetDetails.cash ?? ''}
            onChange={(e) =>
              onUpdateAssetDetails({ cash: parseAmount(e.target.value) })
            }
          />
        );
      case 'gold':
        return renderGold();
      case 'silver':
        return (
          <div className="space-y-4">
            <Input
              label="Weight in grams"
              isGrams
              prefix=""
              value={assetDetails.silver?.weightGrams ?? ''}
              onChange={(e) =>
                onUpdateAssetDetails({
                  silver: {
                    weightGrams: parseAmount(e.target.value),
                    pricePerGram: silverPriceAED,
                  },
                })
              }
            />
            <div className="flex items-center gap-2 text-sm">
              <span>Silver price: {formatAEDSafe(silverPriceAED)}/gram</span>
              <Badge variant={isLivePrice ? 'live' : 'estimated'}>
                {isLivePrice ? 'Live price' : 'Estimated price'}
              </Badge>
            </div>
            <p className="text-sm font-medium text-mal-purple">
              Estimated value: {formatAEDSafe(silverEstimated)}
            </p>
          </div>
        );
      case 'investments':
        return (
          <div className="space-y-4">
            <Input
              label="Approximate current market value"
              tooltip="Include shares, mutual funds, ETFs, and crypto at today's value"
              value={assetDetails.investments ?? ''}
              onChange={(e) =>
                onUpdateAssetDetails({
                  investments: parseAmount(e.target.value),
                })
              }
            />
            <Card className="bg-mal-purple-light/30">
              <p className="text-xs text-mal-gray-dark">
                For stocks, scholars recommend calculating Zakat on the
                zakatable portion (cash + receivables) of the company. Using
                full market value is a safe estimate.
              </p>
            </Card>
          </div>
        );
      case 'property':
        return renderProperty();
      case 'business':
        return renderBusiness();
      case 'receivables':
        return (
          <div className="space-y-4">
            <Input
              label="Total amount"
              value={assetDetails.receivables ?? ''}
              onChange={(e) =>
                onUpdateAssetDetails({
                  receivables: parseAmount(e.target.value),
                })
              }
            />
            <p className="text-sm font-medium">
              Is this likely to be repaid within a year?
            </p>
            <div className="flex gap-3">
              <Button
                variant={receivableRepayable === 'yes' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => {
                  setReceivableRepayable('yes');
                  onUpdateAssetDetails({ receivablesRepayable: 'yes' });
                }}
              >
                Yes
              </Button>
              <Button
                variant={
                  receivableRepayable === 'uncertain' ? 'primary' : 'secondary'
                }
                size="sm"
                onClick={() => {
                  setReceivableRepayable('uncertain');
                  onUpdateAssetDetails({ receivablesRepayable: 'uncertain' });
                }}
              >
                Uncertain
              </Button>
            </div>
            {receivableRepayable === 'uncertain' && (
              <p className="text-xs text-mal-gray-dark">
                You may include a conservative estimate of what you expect to
                recover.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-mal-purple">
          {config.label} · {subStepIndex + 1} of {totalSubSteps} assets
        </p>
        <h1 className="mt-1 text-2xl text-mal-dark">{config.label}</h1>
        <p className="mt-2 text-mal-gray-dark">{config.subtitle}</p>
      </div>

      <Card>{renderContent()}</Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>
          {subStepIndex < totalSubSteps - 1 ? 'Next asset →' : 'Continue to debts →'}
        </Button>
      </div>
    </div>
  );
}
