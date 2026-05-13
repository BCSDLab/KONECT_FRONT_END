import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

interface UseChatRoomScrollParams {
  chatRoomId?: string;
  chatMessagesLength: number;
  latestMessageId?: number | string;
  targetMessageId?: number;
  fetchNextPage: () => void;
  fetchPreviousPage: () => void;
  hasNextPage: boolean | undefined;
  hasPreviousPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isFetchingPreviousPage: boolean;
}

const BOTTOM_THRESHOLD_PX = 80;

const isNearBottom = (container: HTMLDivElement) => {
  return container.scrollHeight - (container.scrollTop + container.clientHeight) <= BOTTOM_THRESHOLD_PX;
};

const useChatRoomScroll = ({
  chatRoomId,
  chatMessagesLength,
  latestMessageId,
  targetMessageId,
  fetchNextPage,
  fetchPreviousPage,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
}: UseChatRoomScrollParams) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatMessagesLengthRef = useRef(chatMessagesLength);
  const isInitialScrollDoneRef = useRef(false);
  const shouldRestoreScrollRef = useRef(false);
  const previousScrollTopRef = useRef(0);
  const previousScrollHeightRef = useRef(0);
  const previousClientHeightRef = useRef(0);
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

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const topRef = useInfiniteScroll(handleFetchNextPage, hasNextPage, isFetchingNextPage, { threshold: 0.1 });

  const handleFetchPreviousPage = useCallback(() => {
    if (!hasPreviousPage || isFetchingPreviousPage) return;

    fetchPreviousPage();
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage]);

  const bottomRef = useInfiniteScroll(handleFetchPreviousPage, hasPreviousPage, isFetchingPreviousPage, {
    threshold: 0.1,
    enabled: targetMessageId != null,
  });

  useEffect(() => {
    chatMessagesLengthRef.current = chatMessagesLength;
  }, [chatMessagesLength]);

  useEffect(() => {
    isInitialScrollDoneRef.current = false;
    shouldRestoreScrollRef.current = false;
    previousScrollTopRef.current = 0;
    previousScrollHeightRef.current = 0;
    previousClientHeightRef.current = 0;
    isNearBottomRef.current = true;
  }, [chatRoomId, targetMessageId]);

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
  }, [chatRoomId, targetMessageId]);

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

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    previousClientHeightRef.current = container.clientHeight;

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            const nextClientHeight = container.clientHeight;

            if (nextClientHeight === previousClientHeightRef.current) return;

            previousClientHeightRef.current = nextClientHeight;

            if (chatMessagesLengthRef.current === 0 || !isNearBottomRef.current) return;

            requestAnimationFrame(scrollToBottom);
          })
        : undefined;

    resizeObserver?.observe(container);

    return () => {
      resizeObserver?.disconnect();
    };
  }, [chatRoomId, targetMessageId, scrollToBottom]);

  return {
    bottomRef,
    scrollContainerRef,
    topRef,
    scrollToBottom,
  };
};

export default useChatRoomScroll;
