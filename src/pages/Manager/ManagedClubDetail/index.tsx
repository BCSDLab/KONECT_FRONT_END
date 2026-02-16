import { Link } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import ClipboardListIcon from '@/assets/svg/clipboard-list.svg';
import PeopleGroupIcon from '@/assets/svg/people-group.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import UserIcon from '@/assets/svg/user.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';

const menuItems = [
  { to: 'info', icon: UserIcon, label: '동아리 정보 관리' },
  { to: 'recruitment', icon: ClipboardListIcon, label: '모집 공고 및 지원서 관리' },
  { to: 'applications', icon: UserSquareIcon, label: '지원자 관리' },
  { to: 'members', icon: PeopleGroupIcon, label: '부원 관리' },
];

function ManagedClubDetail() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <UserInfoCard type="detail" />
      <div className="flex flex-col gap-2 rounded-sm bg-white p-2">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-4">
                <Icon />
                <div className="text-sub2">{label}</div>
              </div>
              <RightArrowIcon />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ManagedClubDetail;
