import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Card({ children, header, footer, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-3xl bg-white p-6 shadow-lg print-card ${className}`}
    >
      {header && <div className="mb-4 border-b border-mal-border pb-4">{header}</div>}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 border-t border-mal-border pt-4">{footer}</div>
      )}
    </div>
  );
}
