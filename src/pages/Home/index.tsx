import { Suspense } from 'react';
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

const SCHEDULE_COLOR = {
  UNIVERSITY: '#AEDCBA',
  CLUB: '#FDE49B',
  COUNCIL: '#E9F2FA',
  DORM: '#B9ADEF',
};

const COUNCIL_NOTICE_PARAMS = { limit: 3 } as const;

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

function ClubCardSkeleton() {
  return (
    <div className="border-indigo-5 flex w-full items-start gap-3 rounded-lg border bg-white p-3">
      <div className="h-13 w-13 shrink-0 animate-pulse rounded-sm bg-indigo-50" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-indigo-50" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-indigo-50" />
        </div>
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-indigo-50" />
      </div>
    </div>
  );
}

function MyClubsSkeleton() {
  return (
    <>
      <div className="h-5 w-20 animate-pulse rounded bg-indigo-50" />
      <div className="flex flex-col gap-2">
        <ClubCardSkeleton />
        <ClubCardSkeleton />
      </div>
    </>
  );
}

function ScheduleCardSkeleton() {
  return (
    <div className="border-indigo-5 mt-2 flex w-full items-start gap-3 rounded-lg border bg-white p-3">
      <div className="h-13 w-13 shrink-0 animate-pulse rounded-sm bg-indigo-50" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-32 animate-pulse rounded bg-indigo-50" />
        <div className="h-3 w-48 animate-pulse rounded bg-indigo-50" />
      </div>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <>
      <ScheduleCardSkeleton />
      <ScheduleCardSkeleton />
    </>
  );
}

function NoticeCardSkeleton() {
  return (
    <div className="bg-indigo-0 border-indigo-5 rounded-lg border-b px-3 py-3">
      <div className="h-4 w-48 animate-pulse rounded bg-indigo-50" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-indigo-50" />
    </div>
  );
}

function NoticeSkeleton() {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <NoticeCardSkeleton />
      <NoticeCardSkeleton />
      <NoticeCardSkeleton />
    </div>
  );
}

function MyClubsSection() {
  const { data: appliedClubsData } = useGetAppliedClubs();
  const { data: joinedClubsData } = useGetJoinedClubs();

  useScrollRestore('home', true);

  if (appliedClubsData.appliedClubs.length === 0 && joinedClubsData.joinedClubs.length === 0) {
    return (
      <Card>
        <div>
          <div className="text-h3">나에게 맞는 동아리를 찾아보세요</div>
        </div>
        <Link to="/clubs" className="bg-primary text-sub2 w-full rounded-sm py-3 text-center text-white">
          동아리 둘러보기
        </Link>
      </Card>
    );
  }

  return (
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
  );
}

function ScheduleSection() {
  const { data: scheduleListData } = useGetUpComingScheduleList();

  const SCHEDULE_LABEL: Record<string, string> = {
    UNIVERSITY: '학사일정',
    CLUB: '동아리',
    COUNCIL: '총동아리',
    DORM: '기숙사',
  };

  if (scheduleListData.schedules.length === 0) {
    return (
      <Card className="mt-2">
        <div className="flex flex-col items-center py-4 text-center">
          <CalendarIcon className="mb-2 text-gray-300" />
          <div className="text-sm text-gray-500">다가오는 일정이 없습니다</div>
          <div className="mt-1 text-xs text-gray-400">동아리에 가입하면 일정을 확인할 수 있어요</div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {scheduleListData.schedules.slice(0, 3).map((schedule) => (
        <NavigateCard key={schedule.title} to={scheduleDateToPath(schedule.startedAt)} className="mt-2 w-full">
          <div className="flex min-w-0 items-center gap-3">
            <div
              style={{ backgroundColor: SCHEDULE_COLOR[schedule.scheduleCategory] }}
              className="bg-indigo-25 flex h-13 w-13 flex-col items-center justify-center rounded-sm"
            >
              <div className="text-center text-xs leading-3 font-bold text-white">
                {schedule.dDay > 0 ? `D-${schedule.dDay}` : 'Today'}
              </div>
              <CalendarIcon style={{ color: '#fff' }} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="text-h3 overflow-hidden text-ellipsis whitespace-nowrap text-indigo-700">
                [{SCHEDULE_LABEL[schedule.scheduleCategory]}] {schedule.title}
              </div>

              <div className="text-sub2 text-indigo-300">
                {formatScheduleDate(schedule.startedAt, schedule.endedAt)}
              </div>
            </div>
          </div>
        </NavigateCard>
      ))}
    </>
  );
}

function CouncilNoticeSection() {
  const { data: councilNoticeData } = useCouncilNotice(COUNCIL_NOTICE_PARAMS);
  const allNotices = councilNoticeData.pages.flatMap((page) => page.councilNotices);

  if (allNotices.length === 0) {
    return (
      <Card className="mt-2">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="text-sm text-gray-500">등록된 공지사항이 없어요</div>
          <div className="mt-1 text-xs text-gray-400">새로운 공지사항이 등록되면 여기에 표시돼요</div>
        </div>
      </Card>
    );
  }

  return (
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
  );
}

function Home() {
  return (
    <div className="flex flex-col gap-3 p-3 pb-6">
      <div className="flex flex-col gap-2">
        <Suspense fallback={<MyClubsSkeleton />}>
          <MyClubsSection />
        </Suspense>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-h3">다가오는 일정</div>
          <Link to="/schedule" className="text-sub2 text-[#3182F6]">
            전체보기
          </Link>
        </div>
        <Suspense fallback={<ScheduleSkeleton />}>
          <ScheduleSection />
        </Suspense>
      </div>

      <div>
        <div className="flex justify-between">
          <div className="text-h3">총동아리연합회</div>
          <Link to="/council?tab=notice" className="text-sub2 text-[#3182F6]">
            더보기
          </Link>
        </div>
        <Suspense fallback={<NoticeSkeleton />}>
          <CouncilNoticeSection />
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
