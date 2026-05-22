# Mal Zakat Calculator

A guided, conversational Zakat calculator — think TurboTax meets fintech. Walk through your assets step by step and receive a clear breakdown of what you owe.

![screenshot](docs/screenshot-placeholder.png)

## Tech stack

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)
![Jest](https://img.shields.io/badge/Jest-RTL-C21325)

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** with Mal design tokens
- **Jest** + React Testing Library
- No external UI libraries

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running tests

```bash
npm test
```

## Architecture decisions

### Wizard flow over a single form

Zakat involves many asset categories with different rules (worn gold vs stored, primary home vs rental income). A linear wizard reduces cognitive load, validates each step, and mirrors how financial guidance products onboard users.

### Pure functions in `zakatEngine`

All calculation logic lives in `src/lib/zakatEngine.ts` as side-effect-free functions. This keeps business rules testable, auditable, and separate from React state. The hook layer only orchestrates user input and calls `calculateZakat`.

### Live gold price with fallback

`useGoldPrice` fetches spot prices from [metals.live](https://api.metals.live/v1/spot/gold), converts USD/troy oz to AED/gram (peg 3.67), and falls back to configured defaults if the API fails. The UI shows **Live price** vs **Estimated price** badges so users know data freshness.

### i18n scaffold for Arabic

Inter handles English UI today; Noto Sans Arabic is loaded in `layout.tsx` for future RTL support. The header includes a disabled **عربي — Coming soon** toggle as a scaffold.

## Project structure

```
src/
  app/           # Next.js routes and global styles
  components/
    wizard/      # Step components (landing via page.tsx)
    ui/          # Design system primitives
    layout/      # Header, Footer
  hooks/         # useZakatCalculator, useGoldPrice
  lib/           # Engine, formatters, constants
  types/         # Shared TypeScript types
  __tests__/     # Unit and component tests
```

## Known limitations

- Scholarly positions differ on worn gold, stock zakatable portions, and debt deductions — this tool uses commonly cited simplified rules.
- Metals.live API availability and CORS may vary; fallback prices are used when live data fails.
- Hawl (one lunar year above Nisab) is disclosed but not validated in the flow.
- Arabic UI is not yet implemented.
- Business inventory and receivables are summed into a single zakatable figure.

## Deployment

Configured for Vercel via `vercel.json`. Run `npm run build` locally to verify production builds.

## Built with Mal's design system

Purple palette (`#351A75`), rounded cards, and conversational copy aligned with Mal brand guidelines.
