import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStudyTime, studyTimeQueryKeys } from './useStudyTime';

export const useStudyTimer = () => {
  const queryClient = useQueryClient();
  const { studyTime, startStudyTimer, stopStudyTimer, isStarting, isStopping } = useStudyTime();

  const [todayAccumulatedSeconds, setTodayAccumulatedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);

  const isStopInProgressRef = useRef(false);

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
      const response = await stopStudyTimer({ totalSeconds: sessionSeconds });

      setTodayAccumulatedSeconds((prev) => response?.dailySeconds ?? prev + sessionSeconds);
      setSessionStartMs(null);
      setIsRunning(false);

      queryClient.invalidateQueries({ queryKey: studyTimeQueryKeys.summary() });
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
    if (isRunning) void stop();
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
    if (studyTime?.todayStudyTime != null) {
      setTodayAccumulatedSeconds(studyTime.todayStudyTime);
    }
  }, [studyTime?.todayStudyTime]);

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
