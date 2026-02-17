import { twMerge } from 'tailwind-merge';

interface ToggleSwitchProps {
  icon?: React.ComponentType;
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

function ToggleSwitch({ icon: Icon, label, enabled, onChange, layout = 'vertical', className }: ToggleSwitchProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <div
      className={twMerge(
        isHorizontal ? 'flex min-h-11 items-center justify-between gap-3' : 'flex flex-col items-center gap-1.5',
        className
      )}
    >
      <div className={twMerge(isHorizontal ? 'flex items-center gap-2.5' : 'flex flex-col items-center gap-1.5')}>
        {Icon && (
          <div className={enabled ? 'text-primary' : 'text-indigo-200'}>
            <Icon />
          </div>
        )}
        <span
          className={twMerge(
            isHorizontal ? 'text-sub2 transition-colors' : 'text-xs leading-3.5 font-medium',
            enabled ? 'text-indigo-700' : 'text-indigo-300'
          )}
        >
          {label}
        </span>
      </div>
      <button
        type="button"
        aria-label={label}
        aria-pressed={enabled}
        onClick={() => onChange(!enabled)}
        className={twMerge(
          'relative touch-manipulation rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 focus-visible:outline-none',
          isHorizontal
            ? `h-7 w-12 border border-indigo-50 ${enabled ? 'bg-indigo-700' : 'bg-indigo-50'}`
            : `h-5 w-9 ${enabled ? 'bg-primary' : 'bg-indigo-100'}`
        )}
      >
        {isHorizontal ? (
          <span
            className={twMerge(
              'absolute top-1/2 left-0.5 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_4px_rgba(2,23,48,0.20)] transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        ) : (
          <span
            className={twMerge(
              'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all',
              enabled ? 'left-[18px]' : 'left-0.5'
            )}
          />
        )}
      </button>
    </div>
  );
}

export default ToggleSwitch;
