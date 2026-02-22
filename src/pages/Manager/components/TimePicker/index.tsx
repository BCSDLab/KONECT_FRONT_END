import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import BottomModal from '@/components/common/BottomModal';
import useBooleanState from '@/utils/hooks/useBooleanState';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  minuteStep?: number;
  renderTrigger?: (toggle: () => void) => React.ReactNode;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const ITEM_HEIGHT = 40;
const PICKER_HEIGHT = 200;
const PADDING_HEIGHT = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function parseTime(value: string): { hour: number; minute: number } {
  const matched = value.match(TIME_REGEX);
  if (!matched) {
    return { hour: 0, minute: 0 };
  }

  return { hour: Number(matched[1]), minute: Number(matched[2]) };
}

function formatTime(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

export default function TimePicker({ value, onChange, minuteStep = 5, renderTrigger }: TimePickerProps) {
  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const [draftHour, setDraftHour] = useState(0);
  const [draftMinute, setDraftMinute] = useState(0);
  const [openSelection, setOpenSelection] = useState<{ hour: number; minute: number } | null>(null);

  const hourOptions = useMemo(() => Array.from({ length: 24 }, (_, hour) => hour), []);
  const safeMinuteStep = useMemo(
    () => (Number.isInteger(minuteStep) && minuteStep > 0 && minuteStep <= 30 ? minuteStep : 5),
    [minuteStep]
  );

  const normalizeMinuteByStep = useCallback(
    (minute: number) => Math.floor(minute / safeMinuteStep) * safeMinuteStep,
    [safeMinuteStep]
  );

  const minuteOptions = useMemo(() => {
    const options: number[] = [];
    for (let minute = 0; minute < 60; minute += safeMinuteStep) {
      options.push(minute);
    }
    return options;
  }, [safeMinuteStep]);

  const syncScrollPosition = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, items: number[], current: number) => {
      if (!ref.current) return;

      const index = items.indexOf(current);
      if (index < 0) return;
      ref.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'auto' });
    },
    []
  );

  const createScrollHandler = useCallback(
    (items: number[], onChangeValue: (value: number) => void) => (e: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(items.length - 1, nearestIndex));
      const next = items[clampedIndex];

      if (next !== undefined) {
        onChangeValue(next);
      }
    },
    []
  );

  const scrollToItem = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>, items: number[], valueToFind: number) => {
      if (!ref.current) return;

      const index = items.indexOf(valueToFind);
      if (index < 0) return;
      ref.current.scrollTo({ top: index * ITEM_HEIGHT, behavior: 'smooth' });
    },
    []
  );

  const handleOpenModal = () => {
    const parsed = parseTime(value);
    const normalizedMinute = normalizeMinuteByStep(parsed.minute);
    setDraftHour(parsed.hour);
    setDraftMinute(normalizedMinute);
    setOpenSelection({ hour: parsed.hour, minute: normalizedMinute });
    openModal();
  };

  const handleCloseModal = () => {
    closeModal();
    setOpenSelection(null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const parsedFromValue = parseTime(value);
    const fallback = {
      hour: parsedFromValue.hour,
      minute: normalizeMinuteByStep(parsedFromValue.minute),
    };
    const initial = openSelection ?? fallback;

    const rafId = requestAnimationFrame(() => {
      syncScrollPosition(hourRef, hourOptions, initial.hour);
      syncScrollPosition(minuteRef, minuteOptions, initial.minute);
    });

    return () => cancelAnimationFrame(rafId);
  }, [isOpen, openSelection, value, hourOptions, minuteOptions, normalizeMinuteByStep, syncScrollPosition]);

  const handleConfirm = () => {
    onChange(formatTime(draftHour, draftMinute));
    handleCloseModal();
  };

  const renderTriggerElement = () => {
    if (renderTrigger) return renderTrigger(handleOpenModal);

    return (
      <button
        type="button"
        onClick={handleOpenModal}
        className="bg-indigo-0 text-h3 w-full rounded-xl border border-indigo-50 px-4 py-3.5 text-indigo-700 shadow-[0_2px_6px_rgba(2,23,48,0.08)]"
      >
        {value}
      </button>
    );
  };

  return (
    <>
      {renderTriggerElement()}
      <BottomModal isOpen={isOpen} onClose={handleCloseModal}>
        <div className="px-5 pt-6 pb-[calc(20px+var(--sab))]">
          <div className="text-h3 text-center text-indigo-700">시간 선택</div>
          <p className="text-cap1 mt-1 text-center text-indigo-300">스크롤해서 시간을 선택하세요</p>
          <div className="bg-indigo-0 relative mt-4 h-[200px] overflow-hidden rounded-2xl border border-indigo-50">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-2 h-20 bg-linear-to-b from-[#F8FAFF] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-20 bg-linear-to-t from-[#F8FAFF] to-transparent" />
            <div className="pointer-events-none absolute inset-y-5 left-1/2 z-2 w-px -translate-x-1/2 bg-indigo-50" />
            <div className="border-indigo-75 pointer-events-none absolute top-1/2 right-3 left-3 z-1 h-10 -translate-y-1/2 rounded-lg border bg-white shadow-[0_4px_12px_rgba(2,23,48,0.08)]" />

            <div className="relative z-3 grid h-full grid-cols-2">
              <div
                ref={hourRef}
                onScroll={createScrollHandler(hourOptions, setDraftHour)}
                className="h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div style={{ height: PADDING_HEIGHT }} />
                {hourOptions.map((hour) => {
                  const isSelected = hour === draftHour;
                  return (
                    <button
                      key={hour}
                      type="button"
                      onClick={() => {
                        setDraftHour(hour);
                        scrollToItem(hourRef, hourOptions, hour);
                      }}
                      className={twMerge(
                        'text-body2 h-10 w-full snap-center transition-all duration-150',
                        isSelected ? 'font-bold tracking-tight text-indigo-700' : 'font-medium text-indigo-300'
                      )}
                    >
                      {pad2(hour)}시
                    </button>
                  );
                })}
                <div style={{ height: PADDING_HEIGHT }} />
              </div>

              <div
                ref={minuteRef}
                onScroll={createScrollHandler(minuteOptions, setDraftMinute)}
                className="h-full snap-y snap-mandatory overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div style={{ height: PADDING_HEIGHT }} />
                {minuteOptions.map((minute) => {
                  const isSelected = minute === draftMinute;
                  return (
                    <button
                      key={minute}
                      type="button"
                      onClick={() => {
                        setDraftMinute(minute);
                        scrollToItem(minuteRef, minuteOptions, minute);
                      }}
                      className={twMerge(
                        'text-body2 h-10 w-full snap-center transition-all duration-150',
                        isSelected ? 'font-bold tracking-tight text-indigo-700' : 'font-medium text-indigo-300'
                      )}
                    >
                      {pad2(minute)}분
                    </button>
                  );
                })}
                <div style={{ height: PADDING_HEIGHT }} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <div className="bg-indigo-0 text-body2 rounded-full border border-indigo-50 px-4 py-1.5 text-indigo-700">
              선택 시간 {formatTime(draftHour, draftMinute)}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleCloseModal}
              className="bg-indigo-0 text-body2 flex-1 rounded-lg border border-indigo-50 py-3 text-indigo-400"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-primary text-body2 flex-1 rounded-lg py-3 text-white"
            >
              확인
            </button>
          </div>
        </div>
      </BottomModal>
    </>
  );
}
