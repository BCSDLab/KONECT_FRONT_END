import type { CSSProperties, ReactNode, Ref } from 'react';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { useSmartBack } from '@/utils/hooks/useSmartBack';
import { cn } from '@/utils/ts/cn';

interface BackTitleHeaderProps {
  title: string;
  onBack?: () => void;
  headerRef?: Ref<HTMLElement>;
  rightSlot?: ReactNode;
  reserveRightSlot?: boolean;
  headerClassName?: string;
  leftContentClassName?: string;
  rightSlotContainerClassName?: string;
  titleClassName?: string;
  style?: CSSProperties;
}

function BackTitleHeader({
  title,
  onBack,
  headerRef,
  rightSlot,
  reserveRightSlot = false,
  headerClassName,
  leftContentClassName,
  rightSlotContainerClassName,
  titleClassName,
  style,
}: BackTitleHeaderProps) {
  const smartBack = useSmartBack();
  const handleBack = onBack ?? smartBack;

  return (
    <header
      ref={headerRef}
      className={cn('fixed top-0 right-0 left-0 z-30 flex items-center bg-white', headerClassName)}
      style={style}
    >
      <div className={cn('flex min-w-0 flex-1 items-center gap-1', leftContentClassName)}>
        <button type="button" aria-label="뒤로가기" onClick={handleBack} className="shrink-0">
          <ChevronLeftIcon />
        </button>
        <h1 className={cn('text-text-900 min-w-0 truncate leading-[1.6] font-semibold', titleClassName)}>{title}</h1>
      </div>

      {rightSlot ? (
        <div className={cn('shrink-0', rightSlotContainerClassName)}>{rightSlot}</div>
      ) : reserveRightSlot ? (
        <div className={cn('size-6 shrink-0', rightSlotContainerClassName)} aria-hidden="true" />
      ) : null}
    </header>
  );
}

export default BackTitleHeader;
