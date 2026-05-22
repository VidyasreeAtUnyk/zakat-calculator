'use client';

import { useEffect, useRef } from 'react';
import { StepAssetDetails } from '@/components/wizard/StepAssetDetails';
import { StepAssetSelector } from '@/components/wizard/StepAssetSelector';
import { StepLiabilities } from '@/components/wizard/StepLiabilities';
import { StepResult } from '@/components/wizard/StepResult';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ZakatInfo } from '@/components/ui/ZakatInfo';
import { formatAEDSafe } from '@/lib/formatters';
import { useZakatCalculator } from '@/hooks/useZakatCalculator';

export default function Home() {
  const wizard = useZakatCalculator();
  const wizardContentRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(wizard.step);

  useEffect(() => {
    if (prevStepRef.current === 0 && wizard.step === 1) {
      wizardContentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    prevStepRef.current = wizard.step;
  }, [wizard.step]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={wizardContentRef}
      id="wizard-content"
      className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10"
    >
      {wizard.step > 0 && wizard.step < 4 && (
        <div className="no-print mb-8">
          <ProgressBar currentStep={wizard.step} />
        </div>
      )}

      {wizard.step === 0 && (
        <>
          <section className="relative overflow-hidden text-center">
            <p
              className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-arabic text-[120px] text-[#F3EFFD] opacity-40"
              aria-hidden
            >
              زكاة
            </p>
            <div className="relative z-10 mx-auto max-w-2xl space-y-6 py-8 sm:py-16">
              <h1 className="text-3xl sm:text-4xl">Calculate Your Zakat</h1>
              <p className="text-mal-gray">
                A guided, step-by-step calculator based on Islamic scholarly
                consensus
              </p>
              <Card className="mx-auto max-w-md text-left">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    Current Nisab (85g gold):{' '}
                    <span className="text-mal-purple">
                      {formatAEDSafe(wizard.nisabThreshold)}
                    </span>
                  </p>
                  <Badge
                    variant={wizard.goldPrice.isLive ? 'live' : 'estimated'}
                  >
                    {wizard.goldPrice.loading
                      ? 'Loading…'
                      : wizard.goldPrice.isLive
                        ? 'Live price'
                        : 'Estimated price'}
                  </Badge>
                </div>
              </Card>
              <Button size="lg" onClick={wizard.beginCalculation}>
                Begin Calculation →
              </Button>
            </div>
          </section>
          <ZakatInfo />
        </>
      )}

      {wizard.step === 1 && (
        <StepAssetSelector
          selectedAssets={wizard.selectedAssets}
          onToggleAsset={wizard.toggleAsset}
          onNext={wizard.goToAssetDetails}
          onBack={() => wizard.setStep(0)}
        />
      )}

      {wizard.step === 2 && wizard.currentDetailAsset && (
        <StepAssetDetails
          currentAsset={wizard.currentDetailAsset}
          subStepIndex={wizard.detailSubStep}
          totalSubSteps={wizard.orderedSelectedAssets.length}
          assetDetails={wizard.assetDetails}
          goldPriceAED={wizard.goldPrice.goldPriceAED}
          silverPriceAED={wizard.goldPrice.silverPriceAED}
          isLivePrice={wizard.goldPrice.isLive}
          onUpdateAssetDetails={wizard.updateAssetDetails}
          onNext={wizard.advanceDetailSubStep}
          onBack={wizard.retreatDetailSubStep}
        />
      )}

      {wizard.step === 3 && (
        <StepLiabilities
          liabilities={wizard.liabilities}
          noDebts={wizard.noDebts}
          onUpdateLiabilities={wizard.updateLiabilities}
          onSetNoDebts={wizard.setNoDebts}
          onNext={wizard.calculateResult}
          onBack={wizard.goBackFromLiabilities}
        />
      )}

      {wizard.step === 4 && wizard.result && (
        <StepResult
          result={wizard.result}
          onRecalculate={wizard.recalculate}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
}
