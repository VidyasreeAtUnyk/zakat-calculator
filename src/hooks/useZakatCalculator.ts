'use client';

import { useCallback, useMemo, useState } from 'react';
import { ASSET_ORDER } from '@/lib/constants';
import { calculateNisab, calculateZakat } from '@/lib/zakatEngine';
import type {
  AssetDetails,
  AssetType,
  Liabilities,
  WizardState,
} from '@/types/zakat.types';
import { useGoldPrice } from '@/hooks/useGoldPrice';

const initialLiabilities: Liabilities = {
  loans: 0,
  rentDue: 0,
  otherDebts: 0,
};

const initialAssetDetails: AssetDetails = {};

export function useZakatCalculator() {
  const goldPrice = useGoldPrice();
  const [step, setStep] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<AssetType[]>([]);
  const [assetDetails, setAssetDetails] =
    useState<AssetDetails>(initialAssetDetails);
  const [liabilities, setLiabilities] = useState<Liabilities>(initialLiabilities);
  const [noDebts, setNoDebts] = useState(false);
  const [result, setResult] = useState<WizardState['result']>(null);
  const [detailSubStep, setDetailSubStep] = useState(0);

  const orderedSelectedAssets = useMemo(
    () => ASSET_ORDER.filter((asset) => selectedAssets.includes(asset)),
    [selectedAssets]
  );

  const nisabThreshold = useMemo(
    () => calculateNisab(goldPrice.goldPriceAED),
    [goldPrice.goldPriceAED]
  );

  const toggleAsset = useCallback((asset: AssetType) => {
    setSelectedAssets((prev) =>
      prev.includes(asset)
        ? prev.filter((a) => a !== asset)
        : [...prev, asset]
    );
  }, []);

  const updateAssetDetails = useCallback((updates: Partial<AssetDetails>) => {
    setAssetDetails((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateLiabilities = useCallback((updates: Partial<Liabilities>) => {
    setLiabilities((prev) => ({ ...prev, ...updates }));
  }, []);

  const beginCalculation = useCallback(() => {
    setStep(1);
  }, []);

  const goToNextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToAssetDetails = useCallback(() => {
    setDetailSubStep(0);
    setStep(2);
  }, []);

  const advanceDetailSubStep = useCallback(() => {
    if (detailSubStep < orderedSelectedAssets.length - 1) {
      setDetailSubStep((prev) => prev + 1);
    } else {
      setStep(3);
      setDetailSubStep(0);
    }
  }, [detailSubStep, orderedSelectedAssets.length]);

  const retreatDetailSubStep = useCallback(() => {
    if (detailSubStep > 0) {
      setDetailSubStep((prev) => prev - 1);
    } else {
      setStep(1);
    }
  }, [detailSubStep]);

  const calculateResult = useCallback(() => {
    const effectiveLiabilities = noDebts
      ? { loans: 0, rentDue: 0, otherDebts: 0 }
      : liabilities;
    const computed = calculateZakat(
      assetDetails,
      effectiveLiabilities,
      goldPrice.goldPriceAED
    );
    setResult(computed);
    setStep(4);
  }, [assetDetails, liabilities, noDebts, goldPrice]);

  const goBackFromLiabilities = useCallback(() => {
    setStep(2);
    setDetailSubStep(Math.max(0, orderedSelectedAssets.length - 1));
  }, [orderedSelectedAssets.length]);

  const recalculate = useCallback(() => {
    setStep(1);
    setResult(null);
    setDetailSubStep(0);
  }, []);

  const resetWizard = useCallback(() => {
    setStep(0);
    setSelectedAssets([]);
    setAssetDetails(initialAssetDetails);
    setLiabilities(initialLiabilities);
    setNoDebts(false);
    setResult(null);
    setDetailSubStep(0);
  }, []);

  const currentDetailAsset = orderedSelectedAssets[detailSubStep];

  return {
    step,
    selectedAssets,
    assetDetails,
    liabilities,
    noDebts,
    result,
    detailSubStep,
    orderedSelectedAssets,
    currentDetailAsset,
    nisabThreshold,
    goldPrice,
    toggleAsset,
    updateAssetDetails,
    updateLiabilities,
    setNoDebts,
    beginCalculation,
    goToNextStep,
    goToPreviousStep,
    goToAssetDetails,
    advanceDetailSubStep,
    retreatDetailSubStep,
    calculateResult,
    goBackFromLiabilities,
    recalculate,
    resetWizard,
    setStep,
  };
}
