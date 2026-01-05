import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStudyTime, STUDY_TIME_SUMMARY_QUERY_KEY } from './useStudyTime';

export const useStudyTimer = () => {
  const queryClient = useQueryClient();
  const { studyTime, startStudyTimer, stopStudyTimer, isStarting, isStopping } = useStudyTime();

  const [, forceTick] = useState(0);
  const [baseTodaySeconds, setBaseTodaySeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtMsRef = useRef<number | null>(null);

  const stoppingRef = useRef(false);

  useEffect(() => {
    if (studyTime) setBaseTodaySeconds(studyTime.todayStudyTime);
  }, [studyTime]);

  const getSessionSeconds = useCallback(() => {
    if (!startedAtMsRef.current) return 0;
    return Math.max(0, Math.floor((Date.now() - startedAtMsRef.current) / 1000));
  }, []);

  const time = baseTodaySeconds + (isRunning ? getSessionSeconds() : 0);

  const start = useCallback(async () => {
    if (isRunning || isStarting || isStopping) return;
    await startStudyTimer();
    startedAtMsRef.current = Date.now();
    setIsRunning(true);
  }, [isRunning, isStarting, isStopping, startStudyTimer]);

  const stop = useCallback(async () => {
    if (!isRunning) return;
    if (stoppingRef.current || isStopping || isStarting) return;

    stoppingRef.current = true;
    try {
      const totalSeconds = getSessionSeconds();
      const res = await stopStudyTimer({ totalSeconds });

      if (res?.dailySeconds != null) setBaseTodaySeconds(res.dailySeconds);
      else setBaseTodaySeconds((prev) => prev + totalSeconds);

      startedAtMsRef.current = null;
      setIsRunning(false);

      queryClient.invalidateQueries({ queryKey: STUDY_TIME_SUMMARY_QUERY_KEY });
    } finally {
      stoppingRef.current = false;
    }
  }, [getSessionSeconds, isRunning, isStarting, isStopping, queryClient, stopStudyTimer]);

  const toggle = useCallback(async () => {
    if (isRunning) return stop();
    return start();
  }, [isRunning, start, stop]);

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => forceTick((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };

    const onPageHide = () => stop();
    const onBlur = () => stop();

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('blur', onBlur);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('blur', onBlur);
    };
  }, [stop]);

  return {
    time,
    isRunning,
    toggle,
    start,
    stop,
    studyTime,
    isStarting,
    isStopping,
  };
};
