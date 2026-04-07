import type { MouseEvent } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { authQueries } from '@/apis/auth/queries';
import { managedClubQueries } from '@/apis/club/managedQueries';
import RightArrowIcon from '@/assets/svg/Chevron-left-dark.svg';
import Card from '@/components/common/Card';

interface ManagerInfoCardProps {
  type?: 'manager' | 'detail';
}

function ManagerUserAvatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden
      className="bg-primary-200 text-primary-800 flex h-12 w-12 items-center justify-center rounded-full"
    >
      {name.charAt(0)}
    </div>
  );
}

function ManagerDetailInfoCard() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const navigate = useNavigate();
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());
  const { data: managedClubList } = useSuspenseQuery(managedClubQueries.clubs());
  const { data: managedClub } = useSuspenseQuery(managedClubQueries.club(clubId));

  const currentClub = managedClubList.joinedClubs.find((club) => club.id === clubId);

  const handleClick = () => {
    navigate(`/mypage/manager/${clubId}/info`);
  };

  return (
    <Card
      onClick={handleClick}
      className="active:bg-indigo-5/50 cursor-pointer rounded-2xl border-0 px-3 py-5.25 shadow-[0px_0px_3px_0px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded" src={managedClub?.imageUrl} alt={`${currentClub?.name} 동아리 사진`} />
          <div>
            <div className="leading-[1.6] font-bold text-indigo-700">{currentClub?.name} 정보</div>
            <div className="text-[11px] leading-3.75 font-medium text-indigo-300">
              {myInfo.studentNumber} / {myInfo.universityName} / {currentClub?.position}
            </div>
          </div>
        </div>
        <RightArrowIcon className="mr-2" />
      </div>
    </Card>
  );
}

function ManagerStats({ onButtonClick }: { onButtonClick: (e: MouseEvent<HTMLButtonElement>, to: string) => void }) {
  const { data: managedClubList } = useSuspenseQuery(managedClubQueries.clubs());
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());

  return (
    <div className="flex justify-between gap-2">
      <div className="border-indigo-5 flex flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border bg-white p-2 text-center">
        <div className="text-body3 text-indigo-400">관리동아리</div>
        <div className="text-h3">{managedClubList.joinedClubs.length}</div>
      </div>
      <button
        type="button"
        onClick={(e) => onButtonClick(e, '/council?tab=notice')}
        className="border-indigo-5 flex flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border bg-white p-2 text-center"
      >
        <div className="text-body3 text-indigo-400">읽지 않은 공지</div>
        <div className="text-h3">{myInfo.unreadCouncilNoticeCount}</div>
      </button>
    </div>
  );
}

function ManagerInfoCard({ type = 'manager' }: ManagerInfoCardProps) {
  const navigate = useNavigate();
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());

  if (type === 'detail') {
    return <ManagerDetailInfoCard />;
  }

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>, to: string) => {
    e.stopPropagation();
    navigate(to);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_0_3px_0_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ManagerUserAvatar name={myInfo.name} />
          <div>
            <div className="text-h2 font-bold text-indigo-700">{myInfo.name}</div>
            <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">
              {myInfo.studentNumber} · {myInfo.universityName}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <ManagerStats onButtonClick={handleButtonClick} />
      </div>
    </div>
  );
}

export default ManagerInfoCard;
