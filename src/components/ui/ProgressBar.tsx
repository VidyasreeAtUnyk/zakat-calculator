import { WIZARD_STEPS } from '@/lib/constants';

export interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

export function ProgressBar({
  currentStep,
  totalSteps = WIZARD_STEPS.length,
}: ProgressBarProps) {
  const progress = Math.min(100, ((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-mal-border">
        <div
          className="h-full rounded-full bg-mal-purple transition-all duration-300"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
        />
      </div>
      <div className="mt-2 flex justify-between gap-1 text-xs text-mal-gray">
        {WIZARD_STEPS.map((label, index) => (
          <span
            key={label}
            className={
              index <= currentStep ? 'font-medium text-mal-purple' : ''
            }
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
