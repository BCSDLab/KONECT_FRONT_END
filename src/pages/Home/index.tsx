import { Link } from 'react-router-dom';
import CalendarIcon from '@/assets/svg/calendar.svg';
import Card from '@/components/common/Card';
import NavigateCard from '@/components/common/NavigateCard';
import useScrollRestore from '@/utils/hooks/useScrollRestore';
import { useCouncilNotice } from '../Club/ClubDetail/hooks/useCouncilNotices';
import CouncilNoticeCard from './components/CouncilNoticeCard';
import SimpleAppliedClubCard from './components/SimpleAppliedClubCard';
import SimpleClubCard from './components/SimpleClubCard';
import { useGetAppliedClubs } from './hooks/useGetAppliedClubs';
import { useGetJoinedClubs } from './hooks/useGetJoinedClubs';
import { useGetUpComingScheduleList } from './hooks/useGetUpComingSchedule';

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

const SCHEDULE_COLOR = {
  UNIVERSITY: '#AEDCBA',
  CLUB: '#FDE49B',
  COUNCIL: '#E9F2FA',
  DORM: '#B9ADEF',
};

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

function scheduleDateToPath(startedAt: string) {
  const [date] = startedAt.split(' ');
  const [year, month, day] = date.split('.').map(Number);

  return `/schedule?year=${year}&month=${month}&day=${day}`;
}

function Home() {
  const { data: appliedClubsData } = useGetAppliedClubs();
  const { data: joinedClubsData } = useGetJoinedClubs();
  const { data: scheduleListData } = useGetUpComingScheduleList();
  const { data: councilNoticeData } = useCouncilNotice({ limit: 3 });
  useScrollRestore('home', !!appliedClubsData);

  const expoPushToken = getCookie('EXPO_PUSH_TOKEN');

  const allNotices = councilNoticeData?.pages.flatMap((page) => page.councilNotices) ?? [];

  return (
    <div className="flex flex-col gap-3 p-3 pb-6">
      <div className="rounded-md bg-gray-100 p-3 text-xs break-all">
        <div className="font-bold">EXPO_PUSH_TOKEN:</div>
        <div className="mt-1">{expoPushToken || '토큰 없음'}</div>
      </div>
      <div className="flex flex-col gap-2">
        {appliedClubsData?.appliedClubs.length === 0 && joinedClubsData?.joinedClubs.length === 0 ? (
          <Card>
            <div>
              <div className="text-h3">나에게 맞는 동아리를 찾아보세요</div>
            </div>

            <Link to="/clubs" className="bg-primary text-sub2 w-full rounded-sm py-3 text-center text-white">
              동아리 둘러보기
            </Link>
          </Card>
        ) : (
          <>
            <div className="text-h3">내 동아리</div>

            <div className="flex flex-col gap-2">
              {appliedClubsData.appliedClubs.map((club) => (
                <SimpleAppliedClubCard key={club.id} club={club} />
              ))}
              {joinedClubsData.joinedClubs.map((club) => (
                <SimpleClubCard key={club.id} club={club} />
              ))}
            </div>
          </>
        )}
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-h3">다가오는 일정</div>
          <Link to="/schedule" className="text-sub2 text-[#3182F6]">
            전체보기
          </Link>
        </div>
        {scheduleListData?.schedules.length === 0 ? (
          <Card className="mt-2">
            <div className="flex flex-col items-center py-4 text-center">
              <CalendarIcon className="mb-2 text-gray-300" />
              <div className="text-sm text-gray-500">다가오는 일정이 없습니다</div>
              <div className="mt-1 text-xs text-gray-400">동아리에 가입하면 일정을 확인할 수 있어요</div>
            </div>
          </Card>
        ) : (
          scheduleListData?.schedules.slice(0, 3).map((schedule) => (
            <NavigateCard key={schedule.title} to={scheduleDateToPath(schedule.startedAt)} className="mt-2">
              <div className="flex items-center gap-3">
                <div
                  style={{ backgroundColor: SCHEDULE_COLOR[schedule.scheduleCategory] }}
                  className="bg-indigo-25 flex h-13 w-13 flex-col items-center justify-center rounded-sm"
                >
                  <div className="text-center text-xs leading-3 font-bold text-white">
                    {schedule.dDay > 0 ? `D-${schedule.dDay}` : 'Today'}
                  </div>
                  <CalendarIcon style={{ color: '#fff' }} />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="text-h3 text-indigo-700">{schedule.title}</div>
                  <div className="text-sub2 text-indigo-300">
                    {formatScheduleDate(schedule.startedAt, schedule.endedAt)}
                  </div>
                </div>
              </div>
            </NavigateCard>
          ))
        )}
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-h3">총동아리연합회</div>
          <Link to="/council" className="text-sub2 text-[#3182F6]">
            더보기
          </Link>
        </div>

        {councilNoticeData && (
          <div className="mt-2 flex flex-col gap-2">
            {allNotices.map((notice) => (
              <CouncilNoticeCard
                id={notice.id}
                isRead={notice.isRead}
                title={notice.title}
                key={notice.id}
                createdAt={notice.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
