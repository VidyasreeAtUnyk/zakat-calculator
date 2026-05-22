'use client';

import { ASSET_CONFIG, ASSET_ORDER } from '@/lib/constants';
import type { AssetType } from '@/types/zakat.types';
import { Button } from '@/components/ui/Button';

export interface StepAssetSelectorProps {
  selectedAssets: AssetType[];
  onToggleAsset: (asset: AssetType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAssetSelector({
  selectedAssets,
  onToggleAsset,
  onNext,
  onBack,
}: StepAssetSelectorProps) {
  const canProceed = selectedAssets.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-mal-dark">What assets do you own?</h1>
        <p className="mt-2 text-mal-gray">
          Select all that apply. We&apos;ll guide you through each one.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {ASSET_ORDER.map((assetType) => {
          const config = ASSET_CONFIG[assetType];
          const isSelected = selectedAssets.includes(assetType);

          return (
            <button
              key={assetType}
              type="button"
              onClick={() => onToggleAsset(assetType)}
              className={`relative rounded-3xl border-2 p-4 text-left transition-all sm:p-5 ${
                isSelected
                  ? 'border-mal-purple bg-mal-purple-light'
                  : 'border-mal-border bg-white hover:border-mal-purple/40'
              }`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-mal-purple text-xs text-white"
                  aria-hidden
                >
                  ✓
                </span>
              )}
              <span className="text-3xl" role="img" aria-hidden>
                {config.icon}
              </span>
              <p className="mt-2 text-sm font-semibold text-mal-dark">
                {config.label}
              </p>
              <p className="mt-1 text-xs text-mal-gray">{config.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
