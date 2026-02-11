import { useEffect, useRef } from 'react';
import { GUIDE_ITEMS } from './guideData';
import GuideProgressBar from './GuideProgressBar';
import { useGuideSlider } from './hooks/useGuideSlider';
import { useSwipe } from './hooks/useSwipe';

function GuidePage() {
  const timerRef = useRef<number | null>(null);

  const { index, next, prev } = useGuideSlider(GUIDE_ITEMS.length);
  const { onTouchStart, onTouchEnd } = useSwipe(next, prev);

  const item = GUIDE_ITEMS[index];

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      next();
    }, item.duration ?? 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [index, item.duration, next]);

  return (
    <div
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-black"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute top-0 right-0 left-0 z-30">
          <GuideProgressBar
            total={GUIDE_ITEMS.length}
            current={index}
            duration={item.duration ?? 3000}
            onComplete={next}
          />
        </div>

        <img
          src={item.image}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-55 blur-xl"
          aria-hidden
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.6))',
          }}
        />

        <div className="relative z-10 h-full w-full">
          <img key={item.id} src={item.image} alt="guide" className="mx-auto h-full w-full object-contain" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.35)',
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex">
        <div className="flex-1" onClick={prev} />
        <div className="flex-1" onClick={next} />
      </div>
    </div>
  );
}

export default GuidePage;
