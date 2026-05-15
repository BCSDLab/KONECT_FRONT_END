import { useEffect, useLayoutEffect, useRef } from 'react';

const scrollPositions: Record<string, number> = {};

/**
 * 페이지 이탈 시 스크롤 위치를 저장하고, 재방문 시 복원하는 훅
 * @param key - 저장할 고유 키
 * @param isReady - 데이터 로드 완료 여부 (무한 스크롤 등에서 데이터 로드 후 복원하기 위함)
 * @param shouldRestore - 스크롤 복원 여부 (false면 저장된 위치를 삭제하고 최상단으로)
 */
export default function useScrollRestore(key: string, isReady: boolean = true, shouldRestore: boolean = true) {
  const hasRestored = useRef(false);
  const scrollPositionRef = useRef(0);

  const getScrollContainer = () => document.querySelector('main');

  useLayoutEffect(() => {
    if (!isReady || hasRestored.current) return;

    if (!shouldRestore) {
      delete scrollPositions[key];
      requestAnimationFrame(() => {
        const container = getScrollContainer();
        if (container) {
          container.scrollTop = 0;
        }
      });
      hasRestored.current = true;
      return;
    }

    const savedPosition = scrollPositions[key];

    if (savedPosition) {
      requestAnimationFrame(() => {
        const container = getScrollContainer();
        if (container) {
          container.scrollTop = savedPosition;
        }
      });
      hasRestored.current = true;
    }
  }, [key, isReady, shouldRestore]);

  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const saveScrollPosition = () => {
      scrollPositionRef.current = container.scrollTop;
      scrollPositions[key] = container.scrollTop;
    };

    container.addEventListener('scroll', saveScrollPosition);

    return () => {
      container.removeEventListener('scroll', saveScrollPosition);
      scrollPositions[key] = scrollPositionRef.current;
    };
  }, [key]);
}
