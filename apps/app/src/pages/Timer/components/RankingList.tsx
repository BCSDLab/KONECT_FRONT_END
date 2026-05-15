import { useEffect, useRef, type TouchEvent, type UIEvent } from 'react';
import type { StudyRanking, StudyRankingParams } from '@/apis/studyTime/entity';
import { type SheetPosition } from '@/components/common/BottomSheet';
import RankingItem from '@/pages/Timer/components/RankingItem';
import { useStudyTimeRanking } from '@/pages/Timer/hooks/useStudyTimeRanking';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

const AUTO_EXPAND_REARM_TOUCH_DELTA_PX = 8;
const AUTO_EXPAND_NO_SCROLL_TOUCH_DELTA_PX = 16;

interface RankingListProps {
  type: StudyRankingParams['type'];
  sort: StudyRankingParams['sort'];
  sheetPosition: SheetPosition;
  hiddenBottomInsetPx: number;
  autoExpandResetKey: number;
  onRequestExpand: () => void;
}

function getRankingItemKey(prefix: 'my' | 'ranking', item: StudyRanking) {
  return `${prefix}-${item.rank}-${item.name}`;
}

export default function RankingList({
  type,
  sort,
  sheetPosition,
  hiddenBottomInsetPx,
  autoExpandResetKey,
  onRequestExpand,
}: RankingListProps) {
  const { rankings, myRankings, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudyTimeRanking({ type, sort });
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const hasTriggeredAutoExpandRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasScrollIntentRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const touchStartYRef = useRef<number | null>(null);

  const shouldPinMyRanking = type === 'PERSONAL';
  const pinnedRankings = shouldPinMyRanking
    ? myRankings.filter((item): item is NonNullable<(typeof myRankings)[number]> => item != null)
    : [];

  const requestExpandIfNeeded = (remainingScroll: number) => {
    if (sheetPosition !== 'half' || hasTriggeredAutoExpandRef.current || !hasScrollIntentRef.current) return;

    if (remainingScroll <= Math.max(24, hiddenBottomInsetPx)) {
      hasTriggeredAutoExpandRef.current = true;
      onRequestExpand();
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0]?.clientY;
    const startY = touchStartYRef.current;

    if (currentY == null || startY == null) return;

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const touchDeltaY = startY - currentY;

    if (
      sheetPosition === 'half' &&
      !hasTriggeredAutoExpandRef.current &&
      scrollHeight <= clientHeight &&
      touchDeltaY >= AUTO_EXPAND_NO_SCROLL_TOUCH_DELTA_PX
    ) {
      hasTriggeredAutoExpandRef.current = true;
      onRequestExpand();
      return;
    }

    if (touchDeltaY >= AUTO_EXPAND_REARM_TOUCH_DELTA_PX) {
      hasScrollIntentRef.current = true;
      requestExpandIfNeeded(scrollHeight - clientHeight - scrollTop);
    }
  };

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (sheetPosition !== 'half' || hasTriggeredAutoExpandRef.current) return;

    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const remainingScroll = scrollHeight - clientHeight - scrollTop;

    if (scrollTop <= 0 || scrollHeight <= clientHeight) return;
    if (scrollTop > lastScrollTopRef.current) {
      hasScrollIntentRef.current = true;
    }

    lastScrollTopRef.current = scrollTop;
    requestExpandIfNeeded(remainingScroll);
  };

  useEffect(() => {
    hasTriggeredAutoExpandRef.current = false;
    hasScrollIntentRef.current = false;
    lastScrollTopRef.current = scrollContainerRef.current?.scrollTop ?? 0;
    touchStartYRef.current = null;
  }, [autoExpandResetKey, sort, type]);

  return (
    <div
      ref={scrollContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onScroll={handleScroll}
      style={{
        paddingBottom: sheetPosition === 'full' ? `${Math.round(hiddenBottomInsetPx) + 16}px` : '16px',
      }}
      className="scrollbar-hidden h-full overflow-y-auto"
    >
      {pinnedRankings.map((item) => (
        <RankingItem key={getRankingItemKey('my', item)} item={item} isMe sort={sort} type={type} />
      ))}
      {rankings.map((item) => (
        <RankingItem key={getRankingItemKey('ranking', item)} item={item} sort={sort} type={type} />
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}
