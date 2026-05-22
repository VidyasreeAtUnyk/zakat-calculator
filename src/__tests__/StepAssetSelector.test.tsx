import { render, screen, fireEvent } from '@testing-library/react';
import { StepAssetSelector } from '@/components/wizard/StepAssetSelector';

describe('StepAssetSelector', () => {
  const onToggleAsset = jest.fn();
  const onNext = jest.fn();
  const onBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all 7 asset types', () => {
    render(
      <StepAssetSelector
        selectedAssets={[]}
        onToggleAsset={onToggleAsset}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(screen.getByText('Cash & Savings')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Investments & Stocks')).toBeInTheDocument();
    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Business Assets')).toBeInTheDocument();
    expect(screen.getByText('Money Owed To You')).toBeInTheDocument();
  });

  it('disables next button with no selection', () => {
    render(
      <StepAssetSelector
        selectedAssets={[]}
        onToggleAsset={onToggleAsset}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  it('enables next button after selection', () => {
    render(
      <StepAssetSelector
        selectedAssets={['cash']}
        onToggleAsset={onToggleAsset}
        onNext={onNext}
        onBack={onBack}
      />
    );

    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
  });

  it('allows multiple assets to be selected', () => {
    render(
      <StepAssetSelector
        selectedAssets={['cash', 'gold']}
        onToggleAsset={onToggleAsset}
        onNext={onNext}
        onBack={onBack}
      />
    );

    fireEvent.click(screen.getByText('Silver'));
    expect(onToggleAsset).toHaveBeenCalledWith('silver');
  });
});
