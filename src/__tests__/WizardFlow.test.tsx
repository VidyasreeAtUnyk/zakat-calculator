import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';

jest.mock('@/hooks/useGoldPrice', () => ({
  useGoldPrice: () => ({
    goldPriceAED: 320,
    silverPriceAED: 3.8,
    loading: false,
    error: false,
    isLive: false,
    lastUpdated: '1 January 2026',
    refetch: jest.fn(),
  }),
}));

describe('Wizard Flow - Integration', () => {
  it('renders homepage with Begin button', () => {
    render(<Home />);
    expect(screen.getByText(/Calculate Your Zakat/i)).toBeInTheDocument();
    expect(screen.getByText(/Begin Calculation/i)).toBeInTheDocument();
  });

  it('shows asset selector after clicking Begin', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText(/Begin Calculation/i));
    expect(screen.getByText(/What assets do you own/i)).toBeInTheDocument();
  });

  it('Next button disabled with no assets selected', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText(/Begin Calculation/i));
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled();
  });

  it('Next button enabled after selecting an asset', async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByText(/Begin Calculation/i));
    await user.click(screen.getByText(/Cash & Savings/i));
    expect(screen.getByRole('button', { name: /continue/i })).not.toBeDisabled();
  });

  it('completes full flow: cash only above nisab', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByText(/Begin Calculation/i));
    await user.click(screen.getByText(/Cash & Savings/i));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const input = screen.getByLabelText(/Total balance/i);
    await user.clear(input);
    await user.type(input, '100000');
    await user.click(screen.getByRole('button', { name: /continue to debts/i }));

    await user.click(screen.getByLabelText(/I have no debts/i));
    await user.click(screen.getByRole('button', { name: /see my zakat result/i }));

    await waitFor(() => {
      expect(screen.getByText(/Zakat is due/i)).toBeInTheDocument();
    });
    expect(screen.getAllByText(/AED 2,500.00/i).length).toBeGreaterThan(0);
  });

  it('completes full flow: cash below nisab', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByText(/Begin Calculation/i));
    await user.click(screen.getByText(/Cash & Savings/i));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const input = screen.getByLabelText(/Total balance/i);
    await user.clear(input);
    await user.type(input, '10000');
    await user.click(screen.getByRole('button', { name: /continue to debts/i }));
    await user.click(screen.getByLabelText(/I have no debts/i));
    await user.click(screen.getByRole('button', { name: /see my zakat result/i }));

    await waitFor(() => {
      expect(screen.getByText(/No Zakat Due/i)).toBeInTheDocument();
    });
  });

  it('recalculate resets to step 1', async () => {
    const user = userEvent.setup();
    render(<Home />);

    await user.click(screen.getByText(/Begin Calculation/i));
    await user.click(screen.getByText(/Cash & Savings/i));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    const input = screen.getByLabelText(/Total balance/i);
    await user.clear(input);
    await user.type(input, '100000');
    await user.click(screen.getByRole('button', { name: /continue to debts/i }));
    await user.click(screen.getByLabelText(/I have no debts/i));
    await user.click(screen.getByRole('button', { name: /see my zakat result/i }));

    await waitFor(() => {
      expect(screen.getByText(/Zakat is due/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /recalculate/i }));

    expect(screen.getByText(/What assets do you own/i)).toBeInTheDocument();
  });
});
