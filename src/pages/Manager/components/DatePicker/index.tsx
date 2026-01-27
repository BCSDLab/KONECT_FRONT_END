import { useRef, useState } from 'react';
import ArrowBackIcon from '@/assets/svg/calendar/chevron-left.svg';
import ArrowGoIcon from '@/assets/svg/calendar/chevron-right.svg';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';
import { formatKoreanDate, getCalendarDates, isSameDate } from '@/utils/ts/calendar';
import { cn } from '@/utils/ts/cn';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

interface DatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  triggerType?: 'default';
  renderTrigger?: (toggle: () => void) => React.ReactNode;
}

export default function DatePicker({ selectedDate, onChange, triggerType, renderTrigger }: DatePickerProps) {
  const { value: isOpen, setFalse: closeModal, toggle: toggleOpen } = useBooleanState(false);
  const [viewDate, setViewDate] = useState(selectedDate);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickTouchOutside(modalRef, closeModal);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const handleSelect = (day: Date) => {
    onChange(day);
    closeModal();
  };

  const renderTriggerElement = () => {
    if (renderTrigger) return renderTrigger(toggleOpen);

    switch (triggerType) {
      case 'default':
      default:
        return (
          <button
            type="button"
            onClick={toggleOpen}
            className={cn(
              'w-[120px] max-w-[120px] rounded-lg border border-[#e1e1e1] bg-[#fafafa] px-3 py-2',
              'font-[pretendard,sans-serif] text-[16px] leading-[160%] font-medium',
              'shadow-[0_2px_4px_rgba(0,0,0,0.40),0_1px_1px_rgba(0,0,0,0.10)]'
            )}
          >
            {formatKoreanDate(selectedDate)}
          </button>
        );
    }
  };

  return (
    <div ref={modalRef} className="relative inline-block font-sans">
      {renderTriggerElement()}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 z-50 w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-[#ccc] bg-white p-2.5">
            <div className="mb-2 flex items-center justify-between px-[30px] font-bold">
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="rounded-md p-1 hover:bg-gray-100 active:bg-gray-200"
              >
                <ArrowBackIcon />
              </button>

              <span>{`${year}.${String(month + 1).padStart(2, '0')}`}</span>

              <button
                type="button"
                aria-label="다음 달"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="rounded-md p-1 hover:bg-gray-100 active:bg-gray-200"
              >
                <ArrowGoIcon />
              </button>
            </div>

            <table className="w-full table-fixed border-collapse text-center">
              <thead>
                <tr>
                  {DAYS.map((d) => (
                    <th key={d} className="p-1 text-xs text-[#999]">
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: getCalendarDates(year, month).length / 7 }, (_, weekIdx) => (
                  <tr key={weekIdx}>
                    {getCalendarDates(year, month)
                      .slice(weekIdx * 7, weekIdx * 7 + 7)
                      .map(({ date, currentMonth }, dayIdx) => {
                        const isSelected = isSameDate(date, selectedDate);
                        const isSunday = dayIdx === 0;
                        const isSaturday = dayIdx === 6;

                        return (
                          <td key={date.toDateString()} className="py-0.5">
                            <button
                              type="button"
                              disabled={!currentMonth}
                              onClick={() => currentMonth && handleSelect(date)}
                              className={cn(
                                'mx-auto grid h-8 w-8 place-items-center rounded-full bg-transparent text-sm',
                                'hover:bg-gray-100 active:bg-gray-200',
                                !currentMonth && 'cursor-default text-[#ccc]',
                                currentMonth && isSunday && 'text-red-500',
                                currentMonth && isSaturday && 'text-blue-500',
                                isSelected && 'bg-[#ff5a5f] font-bold text-white hover:bg-[#ff5a5f] active:bg-[#ff5a5f]'
                              )}
                            >
                              {date.getDate()}
                            </button>
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
