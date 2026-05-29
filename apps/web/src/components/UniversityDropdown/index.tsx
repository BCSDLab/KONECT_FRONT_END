import { useState } from 'react';

import DownArrow from '@/assets/arrow-down.svg';

interface UniversityOption {
  id: string;
  name: string;
}
interface UniversityDropdownProps {
  options: UniversityOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function UniversityDropdown({
  options,
  value,
  onChange,
  placeholder = '(필수) 대학교를 선택해주세요.',
}: UniversityDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === value);

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="border-text-100 text-text-400 flex h-15.25 w-full items-center justify-between rounded-[20px] border px-7.5 py-6.5 text-[20px] leading-10 font-medium"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {selectedOption?.name ?? placeholder}
        <DownArrow />
      </button>
      {isOpen && (
        <div className="border-text-100 absolute top-full left-0 z-10 mt-2 flex w-full flex-col items-start gap-5 self-stretch rounded-[20px] border bg-[#FFF] px-7.5 py-6.5">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="text-text-400 text-[20px] leading-10 font-medium"
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
