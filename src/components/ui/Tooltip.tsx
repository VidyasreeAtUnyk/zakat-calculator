'use client';

import { useId, useState } from 'react';

export interface TooltipProps {
  content: string;
  className?: string;
}

export function Tooltip({ content, className = '' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        className="flex h-5 w-5 items-center justify-center rounded-full border border-mal-border text-xs text-mal-gray transition-colors hover:border-mal-purple hover:text-mal-purple"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((prev) => !prev)}
      >
        ?
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-xl border border-mal-border bg-white px-3 py-2 text-xs text-mal-dark shadow-lg"
        >
          {content}
        </span>
      )}
    </span>
  );
}
