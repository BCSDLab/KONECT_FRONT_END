import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/utils/ts/cn';
import BackTitleHeader from './BackTitleHeader';

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
  const headerStyle = {
    minHeight: 'var(--subpage-header-height)',
  } as CSSProperties;

  return (
    <BackTitleHeader
      title={title}
      rightSlot={rightSlot}
      reserveRightSlot
      headerClassName={cn('justify-between rounded-b-3xl px-4 py-3', shadowClassName)}
      titleClassName="text-sub1 text-indigo-700"
      style={headerStyle}
    />
  );
}

export default SubpageHeader;
