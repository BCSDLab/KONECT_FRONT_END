import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStudyTime, STUDY_TIME_SUMMARY_QUERY_KEY } from './useStudyTime';

function useAutoStopOnBackgroundOrBlur(isRunning: boolean, stop: () => Promise<void>) {
  const isRunningRef = useRef(isRunning);
  const stopRef = useRef(stop);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  useEffect(() => {
    const stopIfRunning = () => {
      if (isRunningRef.current) void stopRef.current();
    };

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
}

export const useStudyTimer = () => {
  const queryClient = useQueryClient();
  const { studyTime, startStudyTimer, stopStudyTimer, isStarting, isStopping } = useStudyTime();

  const [todayAccumulatedSeconds, setTodayAccumulatedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);

  const sessionStartTimeRef = useRef<number | null>(null);
  const isStopInProgressRef = useRef(false);

  const getSessionSeconds = useCallback(() => {
    if (!sessionStartTimeRef.current) return 0;
    return Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);
  }, []);

  const start = useCallback(async () => {
    if (isRunning || isStarting || isStopping) return;

    try {
      await startStudyTimer();

      const now = Date.now();
      sessionStartTimeRef.current = now;
      setSessionStartMs(now);
      setIsRunning(true);
    } catch (error) {
      console.error('타이머 시작 실패:', error);
    }
  }, [isRunning, isStarting, isStopping, startStudyTimer]);

  const stop = useCallback(async () => {
    if (!isRunning || isStopInProgressRef.current || isStarting || isStopping) return;

    isStopInProgressRef.current = true;

    try {
      const sessionSeconds = getSessionSeconds();
      const response = await stopStudyTimer({ totalSeconds: sessionSeconds });

      setTodayAccumulatedSeconds((prev) => response?.dailySeconds ?? prev + sessionSeconds);

      sessionStartTimeRef.current = null;
      setSessionStartMs(null);
      setIsRunning(false);

      queryClient.invalidateQueries({ queryKey: STUDY_TIME_SUMMARY_QUERY_KEY });
    } catch (error) {
      console.error('타이머 정지 실패:', error);
      sessionStartTimeRef.current = null;
      setSessionStartMs(null);
      setIsRunning(false);
    } finally {
      isStopInProgressRef.current = false;
    }
  }, [isRunning, isStarting, isStopping, getSessionSeconds, stopStudyTimer, queryClient]);

  useAutoStopOnBackgroundOrBlur(isRunning, stop);

  useEffect(() => {
    if (studyTime?.todayStudyTime != null) {
      setTodayAccumulatedSeconds(studyTime.todayStudyTime);
    }
  }, [studyTime?.todayStudyTime]);

  const toggle = useCallback(() => (isRunning ? stop() : start()), [isRunning, start, stop]);

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
