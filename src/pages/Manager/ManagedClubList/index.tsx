import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import RightArrowIcon from '@/assets/svg/Chevron-left-dark.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';

function ManagedClubList() {
  const { data: managedClubList } = useSuspenseQuery(managedClubQueries.clubs());

  return (
    <div className="flex flex-col gap-7 p-[19px]">
      <UserInfoCard type="manager" />
      <div className="flex flex-col gap-3">
        <p className="text-sub1 text-indigo-700">동아리 목록</p>
        <div className="flex flex-col gap-2">
          {managedClubList.joinedClubs.map((club) => (
            <Link
              to={`${club.id}`}
              key={club.id}
              className="border-indigo-5 active:bg-indigo-5 flex items-center justify-between rounded-2xl border bg-white p-3 transition-colors"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <img
                  src={club.imageUrl}
                  alt="Club Avatar"
                  className="border-indigo-5 h-12 w-12 rounded-sm border object-cover"
                />
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="text-sub2 truncate text-indigo-700">{club.name}</span>
                  <span className="text-cap1 truncate text-indigo-300">{club.categoryName}</span>
                </div>
              </div>
              <RightArrowIcon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagedClubList;
