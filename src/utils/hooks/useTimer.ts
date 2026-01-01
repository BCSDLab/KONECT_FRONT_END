import { useEffect, useRef, useState } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const wasRunningRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        wasRunningRef.current = true;
        setIsRunning(false);
      } else if (!document.hidden && wasRunningRef.current) {
        wasRunningRef.current = false;
        setIsRunning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning]);

  const toggle = () => setIsRunning((prev) => !prev);
  const reset = () => setTime(0);

  return { time, isRunning, toggle, reset };
};
