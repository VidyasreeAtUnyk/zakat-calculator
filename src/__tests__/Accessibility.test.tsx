import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Home from '@/app/page';

expect.extend(toHaveNoViolations);

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

describe('Accessibility', () => {
  it('homepage has no accessibility violations', async () => {
    const { container } = render(<Home />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all inputs have associated labels', () => {
    render(<Home />);
    const inputs = screen.queryAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toHaveAccessibleName();
    });
  });

  it('all buttons have accessible names', () => {
    render(<Home />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName();
    });
  });
});
