import clsx from 'clsx';
import { formatTime } from '@/utils/ts/time';

interface TimerButtonProps {
  time: number;
  isRunning: boolean;
  onToggle: () => void;
}

function TimerButton({ time, isRunning, onToggle }: TimerButtonProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        height: 'min(45vh, 90vw)',
        width: 'min(45vh, 90vw)',
        containerType: 'size',
      }}
      className={clsx(
        'relative mx-auto flex flex-col items-center justify-center gap-1 rounded-full',
        isRunning ? 'z-40 bg-[#5f7691] text-white' : 'bg-indigo-0 z-10 border border-[#ccc] text-indigo-300'
      )}
    >
      <div style={{ fontSize: '5cqw' }} className="font-medium">
        오늘의 누적 시간
      </div>
      <div style={{ fontSize: '18cqw' }} className="font-semibold">
        {formatTime(time)}
      </div>
      <div style={{ fontSize: '4.5cqw' }} className="px-2 text-center font-medium">
        {isRunning ? '타이머가 작동중입니다!' : '화면을 클릭해 타이머를 작동시키세요!'}
      </div>
    </button>
  );
}

export default TimerButton;
