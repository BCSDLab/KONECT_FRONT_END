import type { CSSProperties, ReactNode, Ref } from 'react';
import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';
import { cn } from '@/utils/ts/cn';

interface SubpageHeaderProps {
  title: string;
  headerRef?: Ref<HTMLElement>;
  rightSlot?: ReactNode;
  shadowClassName?: string;
  headerClassName?: string;
}

function SubpageHeader({
  title,
  headerRef,
  rightSlot,
  shadowClassName = 'shadow-[0_0_20px_rgba(0,0,0,0.03)]',
  headerClassName,
}: SubpageHeaderProps) {
  const headerStyle = headerClassName
    ? undefined
    : ({ minHeight: 'var(--subpage-header-height)' } as CSSProperties);

  return (
    <BackTitleHeader
      title={title}
      headerRef={headerRef}
      rightSlot={rightSlot}
      reserveRightSlot
      headerClassName={cn('justify-between rounded-b-3xl px-4 py-3', shadowClassName, headerClassName)}
      titleClassName="text-sub1 text-indigo-700"
      style={headerStyle}
    />
  );
}

export default SubpageHeader;
