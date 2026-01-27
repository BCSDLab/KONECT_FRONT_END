import { Link } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import { useManagerQuery } from '../hooks/useManagerQuery';

function ManagedClubList() {
  const { managedClubList } = useManagerQuery();

  return (
    <div className="flex flex-col gap-2 p-3">
      <UserInfoCard type="manager" />
      <div className="flex flex-col gap-2 rounded-sm bg-white p-2">
        {managedClubList.joinedClubs.map((club) => (
          <Link to={`${club.id}`} key={club.id} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-4">
                <img src={club.imageUrl} alt="Club Avatar" className="h-10 w-10" />
                <div className="text-sub2">{club.name}</div>
              </div>
              <RightArrowIcon />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ManagedClubList;
