import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import type { HomeClubCardItem } from '@/pages/Home/types';

const INDICATOR_TRACK_WIDTH = 60;
const MIN_INDICATOR_THUMB_WIDTH = 12;

type DisplayClub = {
  club: HomeClubCardItem;
  key: string;
};

interface UseInfiniteClubCarouselParams {
  clubs: HomeClubCardItem[];
}

const buildDisplayClubs = (clubs: HomeClubCardItem[], shouldLoop: boolean) => {
  if (!shouldLoop) {
    return clubs.map((club) => ({
      club,
      key: `club-${club.id}`,
    }));
  }

  // 가운데 세그먼트를 기준으로 자연스럽게 이어지도록 목록을 3번 복제한다.
  return Array.from({ length: 3 }, (_, segmentIndex) =>
    clubs.map((club, clubIndex) => ({
      club,
      key: `segment-${segmentIndex}-${clubIndex}-${club.id}`,
    }))
  ).flat();
};

export const useInfiniteClubCarousel = ({ clubs }: UseInfiniteClubCarouselParams) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const restoreSnapFrameRef = useRef<number | null>(null);
  const scrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAdjustingLoopRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldLoop = clubs.length > 2;
  const shouldCenterCard = clubs.length > 2;
  const showIndicator = clubs.length > 2;

  const displayClubs = useMemo<DisplayClub[]>(() => buildDisplayClubs(clubs, shouldLoop), [clubs, shouldLoop]);

  const clearRestoreSnapFrame = () => {
    if (restoreSnapFrameRef.current !== null) {
      window.cancelAnimationFrame(restoreSnapFrameRef.current);
      restoreSnapFrameRef.current = null;
    }
  };

  const clearScrollEndTimer = () => {
    if (scrollEndTimerRef.current !== null) {
      clearTimeout(scrollEndTimerRef.current);
      scrollEndTimerRef.current = null;
    }
  };

  const setCarouselIndex = (nextIndex: number) => {
    if (activeIndexRef.current === nextIndex) {
      return;
    }

    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  const getSlideOffset = (index: number) => {
    const scrollNode = scrollRef.current;
    const trackNode = scrollNode?.firstElementChild as HTMLDivElement | null;
    const slideNode = trackNode?.children.item(index) as HTMLDivElement | null;

    if (!scrollNode || !slideNode) return 0;

    if (!shouldCenterCard) {
      return slideNode.offsetLeft;
    }

    return slideNode.offsetLeft - (scrollNode.clientWidth - slideNode.clientWidth) / 2;
  };

  const getClosestSlideIndex = () => {
    const scrollNode = scrollRef.current;
    const trackNode = scrollNode?.firstElementChild as HTMLDivElement | null;
    if (!scrollNode || !trackNode) return null;

    const slideNodes = Array.from(trackNode.children) as HTMLDivElement[];
    if (slideNodes.length === 0) return null;

    return slideNodes.reduce((closestIndex, _slideNode, index) => {
      const nextDistance = Math.abs(getSlideOffset(index) - scrollNode.scrollLeft);
      const prevDistance = Math.abs(getSlideOffset(closestIndex) - scrollNode.scrollLeft);

      return nextDistance < prevDistance ? index : closestIndex;
    }, 0);
  };

  const jumpToLoopPosition = (left: number) => {
    const scrollNode = scrollRef.current;
    if (!scrollNode) return;

    // 루프 보정 중에는 snap을 잠시 꺼서 점프가 눈에 띄지 않게 한다.
    clearRestoreSnapFrame();
    isAdjustingLoopRef.current = true;
    scrollNode.style.scrollSnapType = 'none';
    scrollNode.scrollLeft = left;

    // scrollLeft 변경을 즉시 레이아웃에 반영(reflow)한 뒤 snap을 동기적으로 복원한다.
    // 기존 double-rAF 방식은 snap이 꺼진 채 2프레임이 렌더되어,
    // 복원 시 위치가 snap point와 미세하게 어긋나면 re-snap 애니메이션이 발생했다.
    void scrollNode.scrollLeft;
    scrollNode.style.scrollSnapType = '';

    restoreSnapFrameRef.current = window.requestAnimationFrame(() => {
      isAdjustingLoopRef.current = false;
      restoreSnapFrameRef.current = null;
    });
  };

  const syncCarouselPosition = useEffectEvent(() => {
    const scrollNode = scrollRef.current;

    if (!scrollNode || clubs.length === 0) return;

    const currentIndex = getClosestSlideIndex();
    if (currentIndex === null) return;

    setCarouselIndex(currentIndex % clubs.length);

    if (!shouldLoop) {
      return;
    }

    const middleStartIndex = clubs.length;
    const middleEndIndex = clubs.length * 2 - 1;

    // 항상 가운데 세그먼트로 되돌려서 무한 루프가 끊기지 않게 유지한다.
    // 상대 offset(scrollLeft ± segmentWidth) 대신 getSlideOffset으로 정확한 snap point를
    // 직접 계산해 부동소수점 오차로 인한 micro re-snap을 방지한다.
    if (currentIndex < middleStartIndex || currentIndex > middleEndIndex) {
      const middleEquivalent = middleStartIndex + (currentIndex % clubs.length);
      const targetLeft = getSlideOffset(middleEquivalent);
      if (Math.abs(targetLeft - scrollNode.scrollLeft) > 1) {
        jumpToLoopPosition(targetLeft);
      }
    }
  });

  const handleScroll = () => {
    if (clubs.length <= 1 || isAdjustingLoopRef.current) return;

    const currentIndex = getClosestSlideIndex();
    if (currentIndex === null) return;

    // Edge 세그먼트(첫 번째/세 번째 복제본)에 있을 때는 activeIndex를 업데이트하지 않는다.
    // 마지막↔첫 번째 경계를 지나는 동안 getClosestSlideIndex()가 두 snap point 사이를
    // 빠르게 오가며 activeIndex가 토글되어 인디케이터가 플리커링하는 것을 방지한다.
    if (shouldLoop && (currentIndex < clubs.length || currentIndex >= clubs.length * 2)) {
      return;
    }

    setCarouselIndex(currentIndex % clubs.length);
  };

  useEffect(() => {
    if (clubs.length === 0) return;

    const frameId = window.requestAnimationFrame(() => {
      const initialIndex = shouldLoop ? clubs.length : 0;
      const scrollNode = scrollRef.current;
      const trackNode = scrollNode?.firstElementChild as HTMLDivElement | null;
      const slideNode = trackNode?.children.item(initialIndex) as HTMLDivElement | null;

      if (!scrollNode || !slideNode) return;

      scrollNode.scrollTo({
        left: shouldCenterCard ? slideNode.offsetLeft - (scrollNode.clientWidth - slideNode.clientWidth) / 2 : 0,
        behavior: 'auto',
      });
      activeIndexRef.current = 0;
      setActiveIndex(0);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [clubs, shouldCenterCard, shouldLoop]);

  useEffect(() => {
    const scrollNode = scrollRef.current;
    if (!scrollNode) return;

    const handleScrollEnd = () => {
      clearScrollEndTimer();
      if (isAdjustingLoopRef.current) return;
      syncCarouselPosition();
    };

    // scrollend is not supported on iOS Safari < 26; use a debounced scroll
    // fallback so loop correction runs reliably on all mobile browsers.
    const handleScrollFallback = () => {
      if (isAdjustingLoopRef.current) return;
      clearScrollEndTimer();
      scrollEndTimerRef.current = setTimeout(() => {
        scrollEndTimerRef.current = null;
        if (isAdjustingLoopRef.current) return;
        syncCarouselPosition();
      }, 150);
    };

    scrollNode.addEventListener('scrollend', handleScrollEnd);
    scrollNode.addEventListener('scroll', handleScrollFallback);
    return () => {
      scrollNode.removeEventListener('scrollend', handleScrollEnd);
      scrollNode.removeEventListener('scroll', handleScrollFallback);
      clearScrollEndTimer();
      clearRestoreSnapFrame();
    };
  }, []);

  const indicatorThumbWidth =
    clubs.length <= 1
      ? INDICATOR_TRACK_WIDTH
      : Math.max(MIN_INDICATOR_THUMB_WIDTH, INDICATOR_TRACK_WIDTH / clubs.length);
  const indicatorRange = INDICATOR_TRACK_WIDTH - indicatorThumbWidth;
  const indicatorOffset = clubs.length <= 1 ? 0 : (indicatorRange * activeIndex) / Math.max(1, clubs.length - 1);

  return {
    displayClubs,
    handleScroll,
    indicatorOffset,
    indicatorThumbWidth,
    scrollRef,
    shouldCenterCard,
    shouldLoop,
    showIndicator,
  };
};
