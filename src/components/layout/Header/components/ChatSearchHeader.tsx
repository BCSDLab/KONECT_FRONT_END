import type { Ref } from 'react';
import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface ChatListHeaderProps {
  title: string;
  headerRef?: Ref<HTMLElement>;
}

export default function ChatSearchHeader({ title, headerRef }: ChatListHeaderProps) {
  return (
    <BackTitleHeader
      title={title}
      headerRef={headerRef}
      headerClassName="h-13 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]"
      rightSlotContainerClassName="flex items-center gap-2"
    />
  );
}
