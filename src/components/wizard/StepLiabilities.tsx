'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import type { Liabilities } from '@/types/zakat.types';

export interface StepLiabilitiesProps {
  liabilities: Liabilities;
  noDebts: boolean;
  onUpdateLiabilities: (updates: Partial<Liabilities>) => void;
  onSetNoDebts: (value: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

function parseAmount(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function StepLiabilities({
  liabilities,
  noDebts,
  onUpdateLiabilities,
  onSetNoDebts,
  onNext,
  onBack,
}: StepLiabilitiesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-mal-dark">Do you have any debts?</h1>
        <p className="mt-2 text-mal-gray">
          Immediate debts due within the next 12 months can be deducted from
          your zakatable wealth.
        </p>
      </div>

      <Card>
        <Toggle
          label="I have no debts"
          checked={noDebts}
          onChange={onSetNoDebts}
        />
      </Card>

      {!noDebts && (
        <div className="space-y-4">
          <Input
            label="Outstanding loans due this year"
            type="number"
            min={0}
            value={liabilities.loans || ''}
            onChange={(e) =>
              onUpdateLiabilities({ loans: parseAmount(e.target.value) })
            }
          />
          <Input
            label="Rent or mortgage payments due"
            subtitle="Only the portion due within the next 12 months"
            type="number"
            min={0}
            value={liabilities.rentDue || ''}
            onChange={(e) =>
              onUpdateLiabilities({ rentDue: parseAmount(e.target.value) })
            }
          />
          <Input
            label="Other immediate debts"
            type="number"
            min={0}
            value={liabilities.otherDebts || ''}
            onChange={(e) =>
              onUpdateLiabilities({ otherDebts: parseAmount(e.target.value) })
            }
          />
        </div>
      )}

      <Card className="bg-mal-warning-light/50">
        <p className="text-sm text-mal-dark">
          Long-term debts like mortgages are generally only deductible for the
          portion due within the year, not the full outstanding balance.
        </p>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext}>See my Zakat result →</Button>
      </div>
    </div>
  );
}
