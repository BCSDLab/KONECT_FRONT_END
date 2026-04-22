import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { getTimerDisplayMode } from '@/constants/timer';
import { useStudyTime } from '@/pages/Timer/hooks/useStudyTime';
import { syncTimerDisplayMode } from '@/utils/ts/nativeBridge';

const TIMER_DISPLAY_MODE = getTimerDisplayMode();

export const useStudyTimer = () => {
  const { studyTime, startStudyTimer, stopStudyTimer, isStarting, isStopping } = useStudyTime();

  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);

  const isStopInProgressRef = useRef(false);
  const todayAccumulatedSeconds = studyTime?.todayStudyTime ?? 0;

  const getSessionSeconds = () => {
    if (sessionStartMs === null) return 0;
    return Math.floor((Date.now() - sessionStartMs) / 1000);
  };

  const start = async () => {
    if (isRunning || isStarting || isStopping) return;

    try {
      await startStudyTimer();
      setSessionStartMs(Date.now());
      setIsRunning(true);
    } catch (error) {
      console.error('타이머 시작 실패:', error);
    }
  };

  const stop = async () => {
    if (!isRunning || isStopInProgressRef.current || isStarting || isStopping) return;

    isStopInProgressRef.current = true;

    try {
      const sessionSeconds = getSessionSeconds();
      await stopStudyTimer({ totalSeconds: sessionSeconds });

      setSessionStartMs(null);
      setIsRunning(false);
    } catch (error) {
      console.error('타이머 정지 실패:', error);
      setSessionStartMs(null);
      setIsRunning(false);
    } finally {
      isStopInProgressRef.current = false;
    }
  };

  // Stop the timer if the page becomes hidden or loses focus
  const stopIfRunning = useEffectEvent(() => {
    if (isRunning) stop();
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) stopIfRunning();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', stopIfRunning);
    window.addEventListener('blur', stopIfRunning);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', stopIfRunning);
      window.removeEventListener('blur', stopIfRunning);
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    syncTimerDisplayMode(true, TIMER_DISPLAY_MODE);

    return () => {
      syncTimerDisplayMode(false, TIMER_DISPLAY_MODE);
    };
  }, [isRunning]);

  const toggle = () => (isRunning ? stop() : start());

  return {
    todayAccumulatedSeconds,
    sessionStartMs,
    isRunning,
    toggle,
    start,
    stop,
    studyTime,
    isStarting,
    isStopping,
  };
};
