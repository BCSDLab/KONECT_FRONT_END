import { useEffect, useState } from 'react';
import { cn } from '@/utils/ts/cn';
import { formatTime } from '@/utils/ts/datetime/time';

interface TimerButtonProps {
  todayAccumulatedSeconds: number;
  sessionStartMs: number | null;
  isRunning: boolean;
  onToggle: () => void;
  size: number;
}

function TimerButton({ todayAccumulatedSeconds, sessionStartMs, isRunning, onToggle, size }: TimerButtonProps) {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const titleFontSize = Math.max(12, Math.min(14, Math.round(size * 0.045)));
  const timeFontSize = Math.max(44, Math.min(64, Math.round(size * 0.205)));
  const helperFontSize = Math.max(12, Math.min(14, Math.round(size * 0.045)));

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => setNowMs(Date.now());

    tick();

    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [isRunning]);

  const sessionSeconds = isRunning && sessionStartMs != null ? Math.floor((nowMs - sessionStartMs) / 1000) : 0;

  const time = todayAccumulatedSeconds + sessionSeconds;

  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
      className={cn(
        'mx-auto flex shrink-0 flex-col items-center justify-center gap-1 rounded-full px-3 py-6 text-center transition-colors',
        isRunning
          ? 'bg-primary-300 border border-white text-white'
          : 'text-text-500 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.03)]'
      )}
    >
      <div
        style={{
          fontSize: `${titleFontSize}px`,
          lineHeight: `${Math.round(titleFontSize * 1.15)}px`,
        }}
        className={cn('font-medium', isRunning ? 'text-white' : 'text-text-500')}
      >
        오늘의 누적 시간
      </div>
      <div
        style={{
          fontSize: `${timeFontSize}px`,
          lineHeight: `${Math.round(timeFontSize * 1.06)}px`,
        }}
        className={cn('font-semibold', isRunning ? 'text-white' : 'text-primary-500')}
      >
        {formatTime(time)}
      </div>
      <div
        style={{
          fontSize: `${helperFontSize}px`,
          lineHeight: `${Math.round(helperFontSize * 1.15)}px`,
        }}
        className={cn('px-2 font-medium', isRunning ? 'text-white' : 'text-text-500')}
      >
        {isRunning ? '타이머가 작동중입니다!' : '화면을 클릭해 타이머를 작동시키세요!'}
      </div>
    </button>
  );
}

export default TimerButton;
