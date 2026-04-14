import { useRef } from 'react';

import DropDownIcon from '@/assets/svg/drop-down-icon.svg';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import { cn } from '@/utils/ts/cn';

const ROLE_OPTIONS = [
  { label: '회장', value: 'PRESIDENT' },
  { label: '부회장', value: 'VICE_PRESIDENT' },
  { label: '운영진', value: 'MANAGER' },
] as const;

export type RoleManageOption = (typeof ROLE_OPTIONS)[number]['value'];

interface RoleManageSelectorProps {
  onChange: (value: RoleManageOption) => void;
  value: RoleManageOption;
}

export default function RoleManageSelector({ onChange, value }: RoleManageSelectorProps) {
  const { value: isOpen, setTrue: open, setFalse: close } = useBooleanState();
  const selectorRef = useRef<HTMLDivElement>(null);

  useClickTouchOutside(selectorRef, close);

  const selectedOption = ROLE_OPTIONS.find((option) => option.value === value);

  return (
    <div ref={selectorRef} className="relative">
      <button
        type="button"
        onClick={() => (isOpen ? close() : open())}
        className="border-text-300 flex items-center justify-center rounded-full border bg-white pr-1 pl-3"
      >
        <span className="text-sub2 text-text-600">{selectedOption?.label}</span>
        <DropDownIcon />
      </button>

      {isOpen && (
        <div className="border-text-300 absolute top-8.5 left-0 z-10 w-18 overflow-hidden rounded-[10px] border bg-white">
          {ROLE_OPTIONS.map((option, index) => {
            const handleClick = () => {
              onChange(option.value);
              close();
            };

            return (
              <button
                key={option.value}
                type="button"
                onClick={handleClick}
                className={cn(
                  'text-sub2 text-text-600 w-full px-3 py-0.75 text-left',
                  index !== ROLE_OPTIONS.length - 1 && 'border-text-200 border-b'
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
