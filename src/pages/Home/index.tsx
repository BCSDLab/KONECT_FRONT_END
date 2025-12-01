import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import ClubCard from '../ClubList/components/ClubCard';
import { useGetClubs } from '../ClubList/hooks/useGetClubs';
import { useCouncilNotice } from './hooks/useCouncilNotices';

function Home() {
  const { data: clubsData } = useGetClubs({ limit: 10, isRecruiting: true });
  const { data: councilNoticeData } = useCouncilNotice();

  const clubs = clubsData?.pages.flatMap((page) => page.clubs) ?? [];

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3 pb-15">
      <div className="flex flex-col gap-2">
        <div className="text-sm leading-4 font-semibold">내 동아리</div>
        <div className="flex flex-col gap-2">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>

      <Card>
        <div className="mb-3">
          <div className="mb-1.5 text-xs leading-3.5">환영합니다!</div>
          <div className="mb-2 text-sm leading-4 font-semibold">나에게 맞는 동아리를 찾아보세요</div>
          <div className="text-xs leading-3.5">42개의 동아리가 기다리고 있어요</div>
        </div>
        <Link to="/clubs" className="w-full rounded-sm bg-[#323532] py-3 text-center text-xs font-medium text-white">
          동아리 둘러보기
        </Link>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="text-sm leading-4 font-semibold">총동아리연합회</div>
          <Link to="/clubs" className="text-xs leading-3 text-[#3182F6]">
            더 보기
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {councilNoticeData?.councilNotices.map((notice) => (
            <Card key={notice.id}>
              <div className="text-xs leading-3.5 font-semibold text-indigo-700">{notice.title}</div>
              <div className="text-xs leading-3.5 font-medium text-indigo-300">{notice.createdAt}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div className="text-sm leading-4 font-semibold">지금 모집중</div>
          <Link to="/clubs" className="text-xs leading-3 text-[#3182F6]">
            전체보기
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {clubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
