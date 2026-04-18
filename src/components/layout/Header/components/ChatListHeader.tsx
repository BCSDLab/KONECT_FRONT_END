import type { Ref } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCircle from '@/assets/svg/add_circle.svg';
import Search from '@/assets/svg/big-search-icon.svg';
import BackTitleHeader from '@/components/layout/Header/components/BackTitleHeader';

interface ChatListHeaderProps {
  title: string;
  headerRef?: Ref<HTMLElement>;
}

export default function ChatListHeader({ title, headerRef }: ChatListHeaderProps) {
  const navigate = useNavigate();
  const rightSlot = (
    <div className="flex gap-4">
      <button type="button" aria-label="검색" className="shrink-0" onClick={() => navigate('/chats/search')}>
        <Search />
      </button>
      <button type="button" aria-label="채팅방 추가" className="shrink-0" onClick={() => navigate('/chats/add')}>
        <AddCircle />
      </button>
    </div>
  );

  return (
    <BackTitleHeader
      title={title}
      headerRef={headerRef}
      rightSlot={rightSlot}
      headerClassName="h-13 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]"
      rightSlotContainerClassName="flex items-center gap-2"
    />
  );
}
