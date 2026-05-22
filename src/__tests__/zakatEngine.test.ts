import {
  calculateGoldValue,
  calculateNisab,
  calculatePropertyValue,
  calculateSilverValue,
  calculateZakat,
} from '@/lib/zakatEngine';

describe('calculateGoldValue', () => {
  it('returns 0 for worn gold', () => {
    expect(
      calculateGoldValue({
        usage: 'worn',
        weightGrams: 100,
        pricePerGram: 320,
      })
    ).toBe(0);
  });

  it('returns correct value for stored gold', () => {
    expect(
      calculateGoldValue({
        usage: 'stored',
        weightGrams: 50,
        pricePerGram: 320,
      })
    ).toBe(16000);
  });
});

describe('calculateSilverValue', () => {
  it('returns weight times price', () => {
    expect(
      calculateSilverValue({ weightGrams: 100, pricePerGram: 3.8 })
    ).toBe(380);
  });
});

describe('calculatePropertyValue', () => {
  it('returns 0 for primary home', () => {
    expect(
      calculatePropertyValue([
        { type: 'primary', estimatedValue: 1_000_000 },
      ])
    ).toBe(0);
  });

  it('returns full value for investment property', () => {
    expect(
      calculatePropertyValue([
        { type: 'investment', estimatedValue: 500_000 },
      ])
    ).toBe(500_000);
  });

  it('returns annual income only for rental', () => {
    expect(
      calculatePropertyValue([
        {
          type: 'rental',
          estimatedValue: 2_000_000,
          rentalIncomeAnnual: 80_000,
        },
      ])
    ).toBe(80_000);
  });
});

describe('calculateNisab', () => {
  it('calculates nisab at price 320', () => {
    expect(calculateNisab(320)).toBe(27200);
  });

  it('calculates nisab at price 350', () => {
    expect(calculateNisab(350)).toBe(29750);
  });
});

describe('calculateZakat', () => {
  const emptyLiabilities = { loans: 0, rentDue: 0, otherDebts: 0 };

  it('returns zero zakat when below nisab', () => {
    const result = calculateZakat(
      { cash: 10_000 },
      emptyLiabilities,
      320
    );
    expect(result.isEligible).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('returns 2.5% zakat when above nisab', () => {
    const result = calculateZakat(
      { cash: 50_000 },
      emptyLiabilities,
      320
    );
    expect(result.isEligible).toBe(true);
    expect(result.zakatDue).toBe(1250);
  });

  it('reduces zakatable wealth by liabilities', () => {
    const result = calculateZakat(
      { cash: 50_000 },
      { loans: 10_000, rentDue: 0, otherDebts: 0 },
      320
    );
    expect(result.netZakatableWealth).toBe(40_000);
    expect(result.zakatDue).toBe(1000);
  });

  it('does not let liabilities make net wealth negative', () => {
    const result = calculateZakat(
      { cash: 30_000 },
      { loans: 50_000, rentDue: 0, otherDebts: 0 },
      320
    );
    expect(result.netZakatableWealth).toBe(0);
    expect(result.totalLiabilities).toBe(30_000);
    expect(result.zakatDue).toBe(0);
  });
});
