const CARDS = [
  {
    icon: '🕌',
    title: 'The Third Pillar of Islam',
    body: 'Zakat is one of the five pillars of Islam. Every Muslim who owns wealth above the Nisab threshold for one lunar year is obligated to give 2.5% to those in need.',
  },
  {
    icon: '⚖️',
    title: 'Who Pays Zakat?',
    body: 'Any Muslim whose net wealth — including cash, gold, investments, and business assets — exceeds the Nisab threshold after deducting immediate debts.',
  },
  {
    icon: '🤲',
    title: 'Where Does Zakat Go?',
    body: 'Zakat must be distributed to one of eight categories defined in the Quran — including the poor, the needy, those in debt, and travellers in need.',
  },
] as const;

export function ZakatInfo() {
  return (
    <section className="relative z-10 mx-auto mt-10 max-w-4xl text-left">
      <h2 className="text-center text-2xl font-semibold text-mal-dark">
        What is Zakat?
      </h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-mal-border bg-white p-5 shadow-sm"
          >
            <div
              className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-mal-purple-light text-xl"
              aria-hidden
            >
              {card.icon}
            </div>
            <h3 className="font-semibold text-[#171717]">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mal-gray-dark">
              {card.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3 rounded-2xl bg-[#F3EFFD] p-4 text-sm leading-relaxed text-mal-dark">
        <span className="shrink-0 text-lg" aria-hidden>
          ℹ️
        </span>
        <p>
          This calculator follows the scholarly consensus used by major Islamic
          finance institutions. Always consult a scholar for complex financial
          situations.
        </p>
      </div>
    </section>
  );
}
