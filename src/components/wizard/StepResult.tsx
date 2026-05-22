'use client';

import { ASSET_CONFIG } from '@/lib/constants';
import { formatAED } from '@/lib/formatters';
import type { ZakatResult } from '@/types/zakat.types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export interface StepResultProps {
  result: ZakatResult;
  onRecalculate: () => void;
  onPrint: () => void;
}

function breakdownLabel(assetType: string): string {
  if (assetType.startsWith('property-')) {
    return `Property ${assetType.split('-')[1]}`;
  }
  const key = assetType as keyof typeof ASSET_CONFIG;
  return ASSET_CONFIG[key]?.label ?? assetType;
}

export function StepResult({ result, onRecalculate, onPrint }: StepResultProps) {
  return (
    <div className="space-y-6 print:space-y-4">
      <div>
        <h1 className="text-2xl text-mal-dark">Your Zakat Summary</h1>
        <p className="mt-2 text-mal-gray">
          Based on the assets and liabilities you entered.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-mal-gray">Total Assets</dt>
              <dd className="font-medium">{formatAED(result.totalAssets)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mal-gray">Total Liabilities</dt>
              <dd className="font-medium">
                {formatAED(result.totalLiabilities)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-mal-border pt-3">
              <dt className="font-semibold text-mal-dark">
                Net Zakatable Wealth
              </dt>
              <dd className="font-bold text-mal-purple">
                {formatAED(result.netZakatableWealth)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mal-gray">Nisab Threshold</dt>
              <dd>{formatAED(result.nisabThreshold)}</dd>
            </div>
          </dl>

          {result.isEligible ? (
            <div className="mt-6 rounded-3xl bg-mal-success-light p-4">
              <p className="text-sm font-medium text-mal-success">
                Zakat is due on your wealth
              </p>
              <p className="mt-2 text-3xl font-bold text-mal-success">
                {formatAED(result.zakatDue)}
              </p>
              <p className="mt-1 text-xs text-mal-gray">
                2.5% of your net zakatable wealth
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-mal-gray-light p-4">
              <p className="text-sm font-medium text-mal-dark">No Zakat Due</p>
              <p className="mt-2 text-sm text-mal-gray">
                Your net wealth of {formatAED(result.netZakatableWealth)} is
                below the Nisab threshold of {formatAED(result.nisabThreshold)}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-mal-border text-mal-gray">
                  <th className="pb-2 pr-2">Asset</th>
                  <th className="pb-2 pr-2">Value</th>
                  <th className="pb-2 pr-2">Zakatable</th>
                  <th className="pb-2">Zakat Share</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((row) => {
                  const zakatShare = row.zakatable
                    ? row.value * 0.025
                    : 0;
                  return (
                    <tr
                      key={`${row.assetType}-${row.value}`}
                      className="border-b border-mal-border/60"
                    >
                      <td className="py-3 pr-2">
                        <span className="font-medium">
                          {breakdownLabel(String(row.assetType))}
                        </span>
                        {row.reason && (
                          <p className="text-xs text-mal-gray">{row.reason}</p>
                        )}
                      </td>
                      <td className="py-3 pr-2">{formatAED(row.value)}</td>
                      <td className="py-3 pr-2">
                        {row.zakatable ? (
                          <span className="text-mal-success" aria-label="Zakatable">
                            ✓
                          </span>
                        ) : (
                          <span className="text-mal-gray" aria-label="Not zakatable">
                            ✗
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {row.zakatable ? formatAED(zakatShare) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div className="no-print flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onRecalculate}>
          Recalculate
        </Button>
        <Button onClick={onPrint}>Download Summary</Button>
      </div>

      <Card className="bg-mal-purple-light/30">
        <p className="text-xs text-mal-gray">
          This calculation assumes your wealth has been held above the Nisab
          threshold for one complete lunar year (Hawl). If you have not yet
          completed your Hawl, Zakat is not yet due.
        </p>
      </Card>
    </div>
  );
}
