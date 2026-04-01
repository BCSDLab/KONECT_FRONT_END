import AddCircle from '@/assets/svg/add_circle.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import Search from '@/assets/svg/search.svg';
import { useSmartBack } from '@/utils/hooks/useSmartBack';

export default function ChatListHeader() {
  const smartBack = useSmartBack();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-13 items-center justify-center rounded-b-3xl bg-white px-4 py-2">
      <button type="button" aria-label="뒤로가기" onClick={smartBack} className="shrink-0">
        <ChevronLeftIcon />
      </button>
      <span className="px-2 py-4 font-semibold">채팅방</span>
      <div className="ml-auto flex items-center gap-2">
        <button type="button" aria-label="검색" className="shrink-0">
          <Search />
        </button>
        <button type="button" aria-label="채팅방 추가" className="shrink-0">
          <AddCircle />
        </button>
      </div>
    </header>
  );
}
