import { startTransition, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { chatQueries } from '@/apis/chat/queries';
import SearchIcon from '@/assets/svg/big-search-icon.svg';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import useDebouncedCallback from '@/utils/hooks/useDebounce';
import { ChatMessageListItem, ChatRoomListItem } from './components/ChatRoomListItem';

function ChatSearchResults({ keyword }: { keyword: string }) {
  const { data, isFetching, isPending } = useQuery({
    ...chatQueries.search(keyword),
    placeholderData: keepPreviousData,
  });

  const backPath = keyword ? `/chats/search?keyword=${encodeURIComponent(keyword)}` : '/chats/search';
  const navigationState = { backPath };
  const hasRoomMatches = Boolean(data?.roomMatches?.rooms?.length);
  const hasMessageMatches = Boolean(data?.messageMatches?.messages?.length);
  const hasResults = hasRoomMatches || hasMessageMatches;

  return (
    <div className="scrollbar-hidden mt-6 min-h-0 w-full flex-1 overflow-y-auto rounded-t-2xl bg-white py-4">
      {isPending && !data ? (
        <RouteLoadingFallback />
      ) : hasResults ? (
        <>
          {data?.roomMatches?.rooms?.map((room) => (
            <ChatRoomListItem key={room.roomId} room={room} navigationState={navigationState} />
          ))}
          {data?.messageMatches?.messages?.map((message, index) => (
            <ChatMessageListItem
              key={`${message.roomId}-${index}`}
              message={message}
              keyword={keyword}
              navigationState={navigationState}
            />
          ))}
        </>
      ) : (
        <div className="text-text-500 flex justify-center px-4 py-10 text-center text-sm leading-[1.6]">
          검색 결과가 없어요
        </div>
      )}

      {isFetching && data && (
        <div className="text-text-400 flex justify-center px-4 pt-4 text-xs leading-[1.6]">검색 중...</div>
      )}
    </div>
  );
}

export default function ChatSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') ?? '';

  const [keyword, setKeyword] = useState(initialKeyword);
  const [debouncedQuery, setDebouncedQuery] = useState(initialKeyword.trim());

  const updateDebouncedQuery = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    startTransition(() => {
      setDebouncedQuery(trimmed);
      setSearchParams(trimmed ? { keyword: trimmed } : {}, { replace: true });
    });
  }, 300);

  const handleChange = (value: string) => {
    setKeyword(value);
    updateDebouncedQuery(value);
  };

  return (
    <div className="flex h-full flex-col items-center px-5 pt-6">
      <div className="flex w-full shrink-0 items-center overflow-hidden rounded-full bg-white px-5 py-2.5">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 text-[15px] leading-[1.6] text-indigo-300"
          placeholder="채팅방명, 채팅으로 검색"
        />
        <SearchIcon />
      </div>
      {debouncedQuery && <ChatSearchResults keyword={debouncedQuery} />}
    </div>
  );
}
