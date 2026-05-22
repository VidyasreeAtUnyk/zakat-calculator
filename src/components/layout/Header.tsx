import Link from 'next/link';

export function Header() {
  return (
    <header className="no-print border-b border-mal-border bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mal-purple text-lg font-semibold text-white"
            aria-hidden
          >
            م
          </div>
          <span className="text-lg font-semibold text-mal-purple">mal</span>
        </Link>
        <button
          type="button"
          disabled
          className="cursor-not-allowed rounded-full border border-mal-border px-3 py-1.5 text-xs text-mal-gray"
          title="Arabic language support coming soon"
        >
          عربي — Coming soon
        </button>
      </div>
    </header>
  );
}
