import { useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import useManagerQuery from '@/pages/Manager/hooks/useManagerQuery';
import { useMyInfo } from '../../Profile/hooks/useMyInfo';

interface UserInfoCardProps {
  type?: 'user' | 'manager';
}

function UserInfoCard({ type = 'user' }: UserInfoCardProps) {
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();
  const { managedClubList } = useManagerQuery();

  const handleClick = (to: string) => {
    navigate(to);
  };

  return (
    <Card>
      <div className="flex items-center gap-3">
        <img className="h-12 w-12 rounded-full" src={myInfo.imageUrl} alt="Member Avatar" />
        <div>
          <div className="text-sub2 text-indigo-700">{myInfo.name}</div>
          <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">
            {myInfo.studentNumber} · {myInfo.universityName}
          </div>
        </div>
      </div>
      {type === 'user' && (
        <div className="flex justify-between gap-2">
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-body3">가입 동아리</div>
            <div className="text-h3 mt-1">{myInfo.joinedClubCount}</div>
          </div>
          <button onClick={() => handleClick('/timer')} className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-body3">순공 시간</div>
            <div className="text-h3 mt-1">{myInfo.studyTime}</div>
          </button>
          <button
            onClick={() => handleClick('/council?tab=notice')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">읽지 않은 공지</div>
            <div className="text-h3 mt-1">{myInfo.unreadCouncilNoticeCount}</div>
          </button>
        </div>
      )}
      {type === 'manager' && (
        <div className="flex justify-between gap-2">
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-body3">관리 동아리</div>
            <div className="text-h3 mt-1">{managedClubList.joinedClubs.length}</div>
          </div>
          <button
            onClick={() => handleClick('/council?tab=notice')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-body3">읽지 않은 공지</div>
            <div className="text-h3 mt-1">{myInfo.unreadCouncilNoticeCount}</div>
          </button>
        </div>
      )}
    </Card>
  );
}

export default UserInfoCard;
