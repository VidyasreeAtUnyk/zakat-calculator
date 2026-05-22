import { render, screen, fireEvent } from '@testing-library/react';
import { StepResult } from '@/components/wizard/StepResult';
import type { ZakatResult } from '@/types/zakat.types';

const eligibleResult: ZakatResult = {
  totalAssets: 50000,
  totalLiabilities: 5000,
  netZakatableWealth: 45000,
  nisabThreshold: 27200,
  isEligible: true,
  zakatDue: 1125,
  breakdown: [
    { assetType: 'cash', value: 50000, zakatable: true },
  ],
};

const ineligibleResult: ZakatResult = {
  totalAssets: 10000,
  totalLiabilities: 0,
  netZakatableWealth: 10000,
  nisabThreshold: 27200,
  isEligible: false,
  zakatDue: 0,
  breakdown: [
    { assetType: 'cash', value: 10000, zakatable: true },
  ],
};

describe('StepResult', () => {
  it('shows eligible state correctly', () => {
    render(
      <StepResult
        result={eligibleResult}
        onRecalculate={jest.fn()}
        onPrint={jest.fn()}
      />
    );

    expect(screen.getByText('Zakat is due on your wealth')).toBeInTheDocument();
    expect(screen.getByText('AED 1,125.00')).toBeInTheDocument();
  });

  it('shows ineligible state correctly', () => {
    render(
      <StepResult
        result={ineligibleResult}
        onRecalculate={jest.fn()}
        onPrint={jest.fn()}
      />
    );

    expect(screen.getByText('No Zakat Due')).toBeInTheDocument();
  });

  it('shows breakdown table', () => {
    render(
      <StepResult
        result={eligibleResult}
        onRecalculate={jest.fn()}
        onPrint={jest.fn()}
      />
    );

    expect(screen.getByText('Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Cash & Savings')).toBeInTheDocument();
  });

  it('calls recalculate handler', () => {
    const onRecalculate = jest.fn();
    render(
      <StepResult
        result={eligibleResult}
        onRecalculate={onRecalculate}
        onPrint={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /recalculate/i }));
    expect(onRecalculate).toHaveBeenCalledTimes(1);
  });
});
