import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';
import { useManagedClub, useGetManagedClubs } from '@/pages/Manager/hooks/useManagedClubs';
import { useMyInfo } from '../../Profile/hooks/useMyInfo';

interface UserInfoCardProps {
  type?: 'user' | 'manager' | 'detail';
}

function ManagerDetailInfoCard() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();
  const { managedClubList } = useGetManagedClubs();
  const { managedClub } = useManagedClub(clubId);

  const currentClub = managedClubList.joinedClubs.find((club) => club.id === clubId);

  const handleClick = () => {
    navigate(`/mypage/manager/${clubId}/info`);
  };

  return (
    <Card onClick={handleClick} className="active:bg-indigo-5/50 cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full" src={managedClub?.imageUrl} alt="Member Avatar" />
          <div>
            <div className={twMerge('text-h2 font-bold text-indigo-700')}>{currentClub?.name} 관리자</div>
            <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">
              {myInfo.studentNumber} · {myInfo.universityName} · {currentClub?.position}
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
  const { managedClubList } = useGetManagedClubs();
  const { myInfo } = useMyInfo();

  return (
    <div className="flex justify-between gap-2">
      <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
        <div className="text-body3">관리 동아리</div>
        <div className="text-h3 mt-1">{managedClubList.joinedClubs.length}</div>
      </div>
      <button
        type="button"
        onClick={(e) => onButtonClick(e, '/council?tab=notice')}
        className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
      >
        <div className="text-body3">읽지 않은 공지</div>
        <div className="text-h3 mt-1">{myInfo.unreadCouncilNoticeCount}</div>
      </button>
    </div>
  );
}

function UserInfoCard({ type }: UserInfoCardProps) {
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();

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

  const cardProps = isClickable
    ? {
        onClick: handleCardClick,
        className: 'cursor-pointer active:bg-indigo-5/50',
      }
    : {};

  return (
    <Card {...cardProps}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full" src={myInfo.imageUrl} alt="Member Avatar" />
          <div>
            <div className={twMerge('text-h2 font-bold text-indigo-700')}>{myInfo.name}</div>
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
            onClick={(e) => handleButtonClick(e, '/timer')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">순공 시간</div>
            <div className="text-h3 mt-1">{myInfo.studyTime}</div>
          </button>
          <button
            onClick={(e) => handleButtonClick(e, '/council?tab=notice')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">읽지 않은 공지</div>
            <div className="text-h3 mt-1">{myInfo.unreadCouncilNoticeCount}</div>
          </button>
        </div>
      )}
      {type === 'manager' && <ManagerStats onButtonClick={handleButtonClick} />}
    </Card>
  );
}

export default UserInfoCard;
