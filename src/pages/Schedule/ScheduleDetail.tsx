import CalendarIcon from '@/assets/svg/calendar.svg';

type scheduleDetailProps = {
  month: number;
  day: number;
};

function ScheduleDetail({ month, day }: scheduleDetailProps) {
  return (
    <div className="flex flex-col gap-2 bg-white px-6">
      <span className="text-[14px] leading-4 font-semibold">
        {month}월 {day}일 일정 상세보기
      </span>
      <div className="flex items-center gap-3 self-stretch rounded-lg border border-[#F4F6F9] bg-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-pink-300">
          <CalendarIcon className="text-indigo-100" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-[14px] leading-[17px] font-bold">일정 제목</div>
          <div className="text-[13px] leading-4 font-[400] text-indigo-300">일정 설명</div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleDetail;
