import type { CSSProperties, ReactNode } from 'react';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { useSmartBack } from '@/utils/hooks/useSmartBack';
import { cn } from '@/utils/ts/cn';

interface SubpageHeaderProps {
  title: string;
  rightSlot?: ReactNode;
  shadowClassName?: string;
}

function SubpageHeader({
  title,
  rightSlot,
  shadowClassName = 'shadow-[0_0_20px_rgba(0,0,0,0.03)]',
}: SubpageHeaderProps) {
  const smartBack = useSmartBack();
  const headerStyle = {
    minHeight: 'var(--subpage-header-height)',
  } as CSSProperties;

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-30 flex items-center justify-between rounded-b-3xl bg-white px-4 py-3',
        shadowClassName
      )}
      style={headerStyle}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <button type="button" aria-label="뒤로가기" onClick={smartBack} className="shrink-0">
          <ChevronLeftIcon />
        </button>
        <h1 className="text-sub1 truncate text-indigo-700">{title}</h1>
      </div>

      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : <div className="size-6 shrink-0" aria-hidden="true" />}
    </header>
  );
}

export default SubpageHeader;
