import { useState, useRef, type HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import CheckIcon from '@/assets/svg/check.svg';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';

type Option<T extends string> = {
  value: T;
  label: string;
};

interface DropdownProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  menuClassName?: string;
}

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  className,
  menuClassName,
  ...props
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickTouchOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={twMerge('relative', className)} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          'flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs leading-4 font-medium transition-all duration-200 ease-out',
          isOpen
            ? 'bg-indigo-5 border border-blue-500 text-indigo-700'
            : 'border-indigo-25 bg-indigo-5 active:bg-indigo-25 border text-indigo-400'
        )}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={twMerge('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <div
        className={twMerge(
          'border-indigo-25 absolute top-full right-0 z-50 mt-1 min-w-20 origin-top-right rounded-lg border bg-white p-1 shadow-lg transition-all duration-200 ease-out',
          isOpen ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-95 opacity-0',
          menuClassName
        )}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleSelect(option.value)}
            className={twMerge(
              'flex w-full items-center justify-between gap-1.5 rounded-md px-2 py-1.5 text-xs leading-4 font-medium transition-colors duration-150',
              option.value === value ? 'bg-indigo-5 text-indigo-700' : 'active:bg-indigo-5 text-indigo-400'
            )}
          >
            <span>{option.label}</span>
            <CheckIcon
              aria-hidden="true"
              className={twMerge(
                'h-3.5 w-3.5 text-blue-500 transition-opacity',
                option.value === value ? 'opacity-100' : 'opacity-0'
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
