import { useEffect, useLayoutEffect, useRef } from 'react';

const scrollPositions: Record<string, number> = {};

/**
 * 페이지 이탈 시 스크롤 위치를 저장하고, 재방문 시 복원하는 훅
 * @param key - 저장할 고유 키
 * @param isReady - 데이터 로드 완료 여부 (무한 스크롤 등에서 데이터 로드 후 복원하기 위함)
 */
export default function useScrollRestore(key: string, isReady: boolean = true) {
  const hasRestored = useRef(false);
  const scrollPositionRef = useRef(0);

  const getScrollContainer = () => document.querySelector('main');

  // 스크롤 위치 복원
  useLayoutEffect(() => {
    if (!isReady || hasRestored.current) return;

    const savedPosition = scrollPositions[key];
    console.log('[useScrollRestore] savedPosition from memory:', savedPosition);

    if (savedPosition) {
      requestAnimationFrame(() => {
        const container = getScrollContainer();
        if (container) {
          container.scrollTop = savedPosition;
          console.log('[useScrollRestore] restored to:', container.scrollTop);
        }
      });
      hasRestored.current = true;
    }
  }, [key, isReady]);

  // 스크롤 이벤트로 메모리에 실시간 저장
  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const saveScrollPosition = () => {
      scrollPositionRef.current = container.scrollTop;
      scrollPositions[key] = container.scrollTop;
      console.log('[useScrollRestore] saved to memory:', container.scrollTop);
    };

    container.addEventListener('scroll', saveScrollPosition);

    return () => {
      container.removeEventListener('scroll', saveScrollPosition);
      scrollPositions[key] = scrollPositionRef.current;
      console.log('[useScrollRestore] cleanup, final position:', scrollPositionRef.current);
    };
  }, [key]);
}
