import { useRef, useState, type HTMLAttributes } from 'react';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import { cn } from '@/utils/ts/cn';

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
  const orderedOptions = [
    ...options.filter((option) => option.value !== value),
    ...options.filter((option) => option.value === value),
  ];

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)} {...props}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex h-[29px] items-center justify-center overflow-hidden rounded-full bg-[#69BFDF] px-2.5 text-[13px] leading-[1.6] font-medium text-white transition-opacity active:opacity-90',
          isOpen && 'opacity-95'
        )}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className={cn('ml-px h-[18px] w-[18px] transition-transform duration-200', isOpen && 'rotate-180')}
        />
      </button>

      <div
        className={cn(
          'absolute top-full right-0 z-50 mt-2 origin-top-right rounded-[10px] border border-[#E7EBEF] bg-white p-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)] transition-all duration-200 ease-out',
          isOpen ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-95 opacity-0',
          menuClassName
        )}
      >
        <div className="flex min-w-14 flex-col gap-1">
          {orderedOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className="text-text-600 flex w-full items-center justify-between gap-2 rounded-md py-0.5 pl-0.5 text-[13px] leading-[1.6] font-medium"
            >
              <span>{option.label}</span>
              {option.value === value ? <span aria-hidden="true" className="size-1 rounded-full bg-[#69BFDF]" /> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
