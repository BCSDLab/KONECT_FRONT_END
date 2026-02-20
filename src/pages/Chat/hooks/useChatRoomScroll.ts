import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

interface UseChatRoomScrollParams {
  chatRoomId?: string;
  chatMessagesLength: number;
  latestMessageId?: number | string;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

const BOTTOM_THRESHOLD_PX = 80;

const isNearBottom = (container: HTMLDivElement) => {
  return container.scrollHeight - (container.scrollTop + container.clientHeight) <= BOTTOM_THRESHOLD_PX;
};

const useChatRoomScroll = ({
  chatRoomId,
  chatMessagesLength,
  latestMessageId,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseChatRoomScrollParams) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInitialScrollDoneRef = useRef(false);
  const shouldRestoreScrollRef = useRef(false);
  const previousScrollTopRef = useRef(0);
  const previousScrollHeightRef = useRef(0);
  const isNearBottomRef = useRef(true);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
    isNearBottomRef.current = true;
  }, []);

  const handleFetchNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const container = scrollContainerRef.current;
    if (container) {
      previousScrollTopRef.current = container.scrollTop;
      previousScrollHeightRef.current = container.scrollHeight;
      shouldRestoreScrollRef.current = true;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const topRef = useInfiniteScroll(handleFetchNextPage, hasNextPage, isFetchingNextPage, { threshold: 0.1 });

  useEffect(() => {
    isInitialScrollDoneRef.current = false;
    shouldRestoreScrollRef.current = false;
    previousScrollTopRef.current = 0;
    previousScrollHeightRef.current = 0;
    isNearBottomRef.current = true;
  }, [chatRoomId]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      isNearBottomRef.current = isNearBottom(container);
    };

    handleScroll();
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [chatRoomId]);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || chatMessagesLength === 0) return;

    if (shouldRestoreScrollRef.current) {
      const heightDelta = container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop = previousScrollTopRef.current + heightDelta;
      shouldRestoreScrollRef.current = false;
      isNearBottomRef.current = isNearBottom(container);
      return;
    }

    if (!isInitialScrollDoneRef.current) {
      scrollToBottom();
      isInitialScrollDoneRef.current = true;
      return;
    }

    if (isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [chatMessagesLength, latestMessageId, scrollToBottom]);

  return {
    scrollContainerRef,
    topRef,
    scrollToBottom,
  };
};

export default useChatRoomScroll;
