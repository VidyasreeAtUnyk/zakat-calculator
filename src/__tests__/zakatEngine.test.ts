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

describe('calculateGoldValue - edge cases', () => {
  it('returns 0 when weight is 0', () => {
    expect(
      calculateGoldValue({
        usage: 'stored',
        weightGrams: 0,
        pricePerGram: 320,
      })
    ).toBe(0);
  });

  it('returns 0 when price is 0', () => {
    expect(
      calculateGoldValue({
        usage: 'stored',
        weightGrams: 50,
        pricePerGram: 0,
      })
    ).toBe(0);
  });

  it('handles decimal grams correctly', () => {
    expect(
      calculateGoldValue({
        usage: 'stored',
        weightGrams: 10.5,
        pricePerGram: 320,
      })
    ).toBe(3360);
  });

  it('worn gold with any weight always returns 0', () => {
    expect(
      calculateGoldValue({
        usage: 'worn',
        weightGrams: 200,
        pricePerGram: 500,
      })
    ).toBe(0);
  });
});

describe('calculateNisab - edge cases', () => {
  it('returns 0 when gold price is 0', () => {
    expect(calculateNisab(0)).toBe(0);
  });

  it('handles decimal gold price', () => {
    expect(calculateNisab(320.5)).toBe(27242.5);
  });
});

describe('calculateZakat - edge cases', () => {
  const emptyLiabilities = { loans: 0, rentDue: 0, otherDebts: 0 };

  it('returns 0 when all assets are 0', () => {
    const result = calculateZakat({}, emptyLiabilities, 320);
    expect(result.zakatDue).toBe(0);
    expect(result.isEligible).toBe(false);
  });

  it('wealth exactly equal to nisab is eligible', () => {
    const result = calculateZakat({ cash: 27_200 }, emptyLiabilities, 320);
    expect(result.isEligible).toBe(true);
    expect(result.zakatDue).toBe(680);
  });

  it('wealth one dirham below nisab is not eligible', () => {
    const result = calculateZakat({ cash: 27_199 }, emptyLiabilities, 320);
    expect(result.isEligible).toBe(false);
    expect(result.zakatDue).toBe(0);
  });

  it('liabilities cannot make zakatable wealth negative', () => {
    const result = calculateZakat(
      { cash: 10_000 },
      { loans: 50_000, rentDue: 0, otherDebts: 0 },
      320
    );
    expect(result.netZakatableWealth).toBe(0);
    expect(result.zakatDue).toBe(0);
  });

  it('liabilities exactly equal to assets', () => {
    const result = calculateZakat(
      { cash: 27_200 },
      { loans: 27_200, rentDue: 0, otherDebts: 0 },
      320
    );
    expect(result.netZakatableWealth).toBe(0);
    expect(result.isEligible).toBe(false);
  });

  it('worn gold is excluded from total assets', () => {
    const result = calculateZakat(
      {
        gold: { usage: 'worn', weightGrams: 100, pricePerGram: 320 },
        cash: 0,
      },
      emptyLiabilities,
      320
    );
    expect(result.totalAssets).toBe(0);
    expect(result.isEligible).toBe(false);
  });

  it('stored gold is included in total assets', () => {
    const result = calculateZakat(
      {
        gold: { usage: 'stored', weightGrams: 100, pricePerGram: 320 },
      },
      emptyLiabilities,
      320
    );
    expect(result.isEligible).toBe(true);
    expect(result.zakatDue).toBe(800);
  });

  it('mixed worn and stored gold calculates correctly', () => {
    const result = calculateZakat(
      {
        gold: { usage: 'stored', weightGrams: 50, pricePerGram: 320 },
        cash: 20_000,
      },
      emptyLiabilities,
      320
    );
    expect(result.totalAssets).toBe(36_000);
    expect(result.zakatDue).toBe(900);
  });

  it('primary property is excluded', () => {
    const result = calculateZakat(
      {
        property: [{ type: 'primary', estimatedValue: 500_000 }],
        cash: 0,
      },
      emptyLiabilities,
      320
    );
    expect(result.isEligible).toBe(false);
  });

  it('investment property is included', () => {
    const result = calculateZakat(
      {
        property: [{ type: 'investment', estimatedValue: 500_000 }],
      },
      emptyLiabilities,
      320
    );
    expect(result.zakatDue).toBe(12_500);
  });

  it('rental property uses only annual income', () => {
    const result = calculateZakat(
      {
        property: [
          {
            type: 'rental',
            estimatedValue: 1_000_000,
            rentalIncomeAnnual: 60_000,
          },
        ],
      },
      emptyLiabilities,
      320
    );
    expect(result.totalAssets).toBe(60_000);
    expect(result.zakatDue).toBe(1500);
  });

  it('multiple properties mixed types', () => {
    const result = calculateZakat(
      {
        property: [
          { type: 'primary', estimatedValue: 800_000 },
          { type: 'investment', estimatedValue: 300_000 },
          {
            type: 'rental',
            estimatedValue: 1_000_000,
            rentalIncomeAnnual: 48_000,
          },
        ],
      },
      emptyLiabilities,
      320
    );
    expect(result.totalAssets).toBe(348_000);
    expect(result.zakatDue).toBe(8700);
  });

  it('breakdown includes reason for excluded assets', () => {
    const result = calculateZakat(
      {
        gold: { usage: 'worn', weightGrams: 50, pricePerGram: 320 },
        property: [{ type: 'primary', estimatedValue: 1_000_000 }],
      },
      emptyLiabilities,
      320
    );
    const goldRow = result.breakdown.find((r) => r.assetType === 'gold');
    const propertyRow = result.breakdown.find((r) =>
      String(r.assetType).startsWith('property')
    );
    expect(goldRow?.reason).toBe('Worn gold is generally exempt from Zakat');
    expect(propertyRow?.reason).toBe('Primary residence is not zakatable');
  });

  it('receivables marked uncertain are excluded', () => {
    const result = calculateZakat(
      {
        cash: 30_000,
        receivables: 50_000,
        receivablesRepayable: 'uncertain',
      },
      emptyLiabilities,
      320
    );
    expect(result.totalAssets).toBe(30_000);
    const receivablesRow = result.breakdown.find(
      (r) => r.assetType === 'receivables'
    );
    expect(receivablesRow?.zakatable).toBe(false);
  });

  it('full calculation with all asset types', () => {
    const result = calculateZakat(
      {
        cash: 100_000,
        gold: { usage: 'stored', weightGrams: 50, pricePerGram: 320 },
        silver: { weightGrams: 100, pricePerGram: 3.8 },
        investments: 50_000,
        property: [
          {
            type: 'rental',
            estimatedValue: 500_000,
            rentalIncomeAnnual: 24_000,
          },
        ],
        business: 30_000,
        receivables: 10_000,
        receivablesRepayable: 'yes',
      },
      { loans: 20_000, rentDue: 0, otherDebts: 0 },
      320
    );
    expect(result.totalAssets).toBe(230_380);
    expect(result.totalLiabilities).toBe(20_000);
    expect(result.netZakatableWealth).toBe(210_380);
    expect(result.zakatDue).toBe(5259.5);
  });
});
