import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { authQueries } from '@/apis/auth/queries';
import { managedClubQueries } from '@/apis/club/managedQueries';
import RightArrowIcon from '@/assets/svg/Chevron-left-dark.svg';
import Card from '@/components/common/Card';
import { cn } from '@/utils/ts/cn';

interface UserInfoCardProps {
  type?: 'user' | 'manager' | 'detail';
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
      className="active:bg-indigo-5/50 cursor-pointer rounded-2xl border-0 px-3 py-[21px] shadow-[0px_0px_3px_0px_rgba(0,0,0,0.15)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded" src={managedClub?.imageUrl} alt={`${currentClub?.name} 동아리 사진`} />
          <div>
            <div className="text-[16px] leading-[1.6] font-bold text-indigo-700">{currentClub?.name} 정보</div>
            <div className="text-[11px] leading-[15px] font-medium text-indigo-300">
              {myInfo.studentNumber} / {myInfo.universityName} / {currentClub?.position}
            </div>
          </div>
        </div>
        <RightArrowIcon className="mr-2" />
      </div>
    </Card>
  );
}

function ManagerStats({
  onButtonClick,
}: {
  onButtonClick: (e: React.MouseEvent<HTMLButtonElement>, to: string) => void;
}) {
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

function UserInfoCard({ type }: UserInfoCardProps) {
  const navigate = useNavigate();
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());

  if (type === 'detail') {
    return <ManagerDetailInfoCard />;
  }

  const isClickable = type === undefined || type === 'user';

  const handleCardClick = () => {
    if (isClickable) {
      navigate('/profile');
    }
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, to: string) => {
    e.stopPropagation();
    navigate(to);
  };

  const cardClassName = cn(
    'rounded-2xl bg-white p-4 shadow-[0_0_3px_0_rgba(0,0,0,0.2)]',
    isClickable && 'cursor-pointer active:bg-indigo-5/50'
  );

  return (
    <div className={cardClassName} onClick={isClickable ? handleCardClick : undefined}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* <img className="h-12 w-12 rounded-full" src={myInfo.imageUrl} alt="Member Avatar" /> */}
          <div className="bg-primary-200 text-primary-800 flex h-12 w-12 items-center justify-center rounded-full">
            {myInfo.name.charAt(0)}
          </div>
          <div>
            <div className={cn('text-h2 font-bold text-indigo-700')}>{myInfo.name}</div>
            <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">
              {myInfo.studentNumber} · {myInfo.universityName}
            </div>
          </div>
        </div>
        {isClickable && <RightArrowIcon className="mr-2" />}
      </div>
      {type === 'user' && (
        <div className="flex justify-between gap-2">
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-body3">가입 동아리</div>
            <div className="text-h3 mt-1">{myInfo.joinedClubCount}</div>
          </div>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, '/timer')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">순공 시간</div>
            <div className="text-h3 mt-1">{myInfo.studyTime}</div>
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, '/council?tab=notice')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">읽지 않은 공지</div>
            <div className="text-h3 mt-1">{myInfo.unreadCouncilNoticeCount}</div>
          </button>
        </div>
      )}
      {type === 'manager' && (
        <div className="mt-4">
          <ManagerStats onButtonClick={handleButtonClick} />
        </div>
      )}
    </div>
  );
}

export default UserInfoCard;
