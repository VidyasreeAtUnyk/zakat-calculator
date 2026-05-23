export function WizardSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="h-8 w-2/3 rounded-xl bg-mal-border" />
      <div className="h-4 w-1/2 rounded-lg bg-mal-border" />
      <div className="rounded-3xl border border-mal-border bg-white p-6">
        <div className="space-y-4">
          <div className="h-10 rounded-xl bg-mal-border" />
          <div className="h-10 rounded-xl bg-mal-border" />
          <div className="h-10 w-3/4 rounded-xl bg-mal-border" />
        </div>
      </div>
      <div className="flex justify-between gap-3">
        <div className="h-11 w-24 rounded-full bg-mal-border" />
        <div className="h-11 w-36 rounded-full bg-mal-border" />
      </div>
    </div>
  );
}

export function ZakatInfoSkeleton() {
  return (
    <section className="mx-auto mt-10 max-w-4xl animate-pulse" aria-hidden>
      <div className="mx-auto h-8 w-48 rounded-lg bg-mal-border" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-mal-border bg-white p-5"
          >
            <div className="mb-4 h-10 w-10 rounded-full bg-mal-border" />
            <div className="h-5 w-3/4 rounded bg-mal-border" />
            <div className="mt-3 h-16 rounded bg-mal-border" />
          </div>
        ))}
      </div>
    </section>
  );
}
