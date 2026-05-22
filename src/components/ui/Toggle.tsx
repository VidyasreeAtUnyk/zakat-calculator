'use client';

export interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}: ToggleProps) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
    >
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-mal-border transition-colors peer-checked:bg-mal-purple peer-focus:ring-2 peer-focus:ring-mal-purple peer-focus:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      <span className="text-sm text-mal-dark">{label}</span>
    </label>
  );
}
