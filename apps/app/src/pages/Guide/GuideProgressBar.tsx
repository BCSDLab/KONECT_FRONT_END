/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react';

interface Props {
  total: number;
  current: number;
  duration: number;
  onComplete: () => void;
}

function GuideProgressBar({ total, current, duration, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setProgress(0);
    startTimeRef.current = null;

    const tick = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const ratio = elapsed / duration;

      if (ratio >= 1) {
        setProgress(100);
        onComplete();
        return;
      }

      setProgress(ratio * 100);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [current, duration, onComplete]);

  return (
    <div className="b flex gap-1 px-4 pt-3 pb-3">
      {Array.from({ length: total }).map((_, idx) => {
        if (idx < current) {
          return <div key={idx} className="h-1 flex-1 rounded-full bg-white" />;
        }

        if (idx === current) {
          return (
            <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full bg-white" style={{ width: `${progress}%` }} />
            </div>
          );
        }

        return <div key={idx} className="h-1 flex-1 rounded-full bg-indigo-100" />;
      })}
    </div>
  );
}

export default GuideProgressBar;
