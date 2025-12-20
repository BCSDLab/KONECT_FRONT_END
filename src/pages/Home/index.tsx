import { Link } from 'react-router-dom';
import CalendarIcon from '@/assets/svg/calendar.svg';
import Card from '@/components/common/Card';
import ClubCard from '../ClubList/components/ClubCard';
import { useGetClubs } from '../ClubList/hooks/useGetClubs';
import SimpleClubCard from './components/SimpleClubCard';
import { useGetJoinedClubs } from './hooks/useGetJoinedClubs';
import { useGetScheduleList } from './hooks/useGetScheduleList';

function formatScheduleDate(startedAt: string, endedAt: string): string {
  const [startDate, startTime] = startedAt.split(' ');
  const [endDate, endTime] = endedAt.split(' ');

  const [startYear, startMonth, startDay] = startDate.split('.');
  const [endYear, endMonth, endDay] = endDate.split('.');

  if (startDate === endDate) {
    return `${startYear}.${startMonth}.${startDay} ${startTime} ~ ${endTime}`;
  } else {
    return `${startYear}.${startMonth}.${startDay} ~ ${endYear}.${endMonth}.${endDay}`;
  }
}

function Home() {
  const { data: clubsData } = useGetClubs({ limit: 10, isRecruiting: true });
  const { data: joinedClubsData } = useGetJoinedClubs();
  const { data: scheduleListData } = useGetScheduleList();

  const clubs = clubsData?.pages.flatMap((page) => page.clubs) ?? [];

  return (
    <div className="flex flex-col gap-3 p-3 pb-6">
      <div className="flex flex-col gap-2">
        {joinedClubsData?.joinedClubs.length === 0 ? (
          <Card>
            <div className="mb-3">
              <div className="mb-1.5 text-xs leading-3.5">환영합니다!</div>
              <div className="mb-2 text-sm leading-4 font-semibold">나에게 맞는 동아리를 찾아보세요</div>
              <div className="text-xs leading-3.5">42개의 동아리가 기다리고 있어요</div>
            </div>

            <Link to="/clubs" className="bg-primary w-full rounded-sm py-3 text-center text-xs font-medium text-white">
              동아리 둘러보기
            </Link>
          </Card>
        ) : (
          <>
            <div className="text-sm leading-4 font-semibold">내 동아리</div>

            <div className="flex flex-col gap-2">
              {joinedClubsData.joinedClubs.map((club) => (
                <SimpleClubCard key={club.id} club={club} />
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-sm leading-4 font-semibold">다가오는 일정</div>
          <Link to="/schedules" className="text-xs leading-3 text-[#3182F6]">
            전체보기
          </Link>
        </div>
        {scheduleListData?.schedules.slice(0, 3).map((schedule) => (
          <Card key={schedule.title} className="mt-2">
            <div className="flex gap-3">
              <div className="bg-indigo-25 flex h-10 w-10 flex-col items-center justify-center rounded-sm">
                <div className="text-primary text-center text-[10px] leading-3 font-bold">
                  {schedule.dDay > 0 ? `D-${schedule.dDay}` : 'Today'}
                </div>
                <CalendarIcon />
              </div>
              <div className="flex flex-1 flex-col justify-center gap-1">
                <div className="text-[15px] leading-[17px] font-bold text-indigo-700">{schedule.title}</div>
                <div className="text-[13px] leading-4 text-indigo-300">
                  {formatScheduleDate(schedule.startedAt, schedule.endedAt)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="text-sm leading-4 font-semibold">지금 모집중</div>
          <Link to="/clubs" className="text-xs leading-3 text-[#3182F6]">
            전체보기
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {clubs.slice(0, 3).map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
