import type { MouseEvent } from 'react';
import MoreHorizontalIcon from '@/assets/svg/more-horizontal.svg';
import { MemberAvatar } from '@/components/common/MemberAvatar';

interface MemberCardProps {
  disabled?: boolean;
  name: string;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  positionLabel: string;
  showAction?: boolean;
  studentNumber: string;
}

export default function MemberCard({
  disabled = false,
  name,
  onAction,
  positionLabel,
  showAction = false,
  studentNumber,
}: MemberCardProps) {
  return (
    <div className="border-indigo-5 flex items-center justify-between rounded-2xl border bg-white p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MemberAvatar name={name} />
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-6 font-semibold text-indigo-700">
            {name} ({studentNumber})
          </div>
          <div className="text-[13px] leading-[1.6] font-medium text-indigo-300">{positionLabel}</div>
        </div>
      </div>

      {showAction && onAction && (
        <button
          type="button"
          onClick={(event) => onAction(event)}
          disabled={disabled}
          aria-label={`${name} 관리`}
          className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-indigo-300 disabled:opacity-50"
        >
          <MoreHorizontalIcon className="h-2 w-3.25" />
        </button>
      )}
    </div>
  );
}
