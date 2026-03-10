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

    restoreSnapFrameRef.current = window.requestAnimationFrame(() => {
      restoreSnapFrameRef.current = window.requestAnimationFrame(() => {
        scrollNode.style.scrollSnapType = '';
        isAdjustingLoopRef.current = false;
        restoreSnapFrameRef.current = null;
      });
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
    const segmentWidth = getSlideOffset(clubs.length * 2) - getSlideOffset(clubs.length);

    if (segmentWidth <= 0) return;

    // 항상 가운데 세그먼트로 되돌려서 무한 루프가 끊기지 않게 유지한다.
    if (currentIndex < middleStartIndex) {
      jumpToLoopPosition(scrollNode.scrollLeft + segmentWidth);
    } else if (currentIndex > middleEndIndex) {
      jumpToLoopPosition(scrollNode.scrollLeft - segmentWidth);
    }
  });

  const handleScroll = () => {
    if (clubs.length <= 1 || isAdjustingLoopRef.current) return;

    const currentIndex = getClosestSlideIndex();
    if (currentIndex === null) return;

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
      if (isAdjustingLoopRef.current) return;
      syncCarouselPosition();
    };

    scrollNode.addEventListener('scrollend', handleScrollEnd);
    return () => {
      scrollNode.removeEventListener('scrollend', handleScrollEnd);
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
