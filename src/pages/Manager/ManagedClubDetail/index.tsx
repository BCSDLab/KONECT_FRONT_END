import { Link } from 'react-router-dom';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import UserIdCardIcon from '@/assets/svg/user-id-card.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import UserIcon from '@/assets/svg/user.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';

const menuItems = [
  { to: 'profile', icon: UserIcon, label: '동아리 프로필 관리' },
  { to: '', icon: FileSearchIcon, label: '동아리 소개 관리' },
  { to: 'recruitment', icon: FileIcon, label: '모집 공고 및 지원서 관리' },
  { to: 'applications', icon: UserSquareIcon, label: '지원자 관리' },
  { to: '', icon: ChatIcon, label: '부원 명부 관리' },
  { to: '', icon: UserIdCardIcon, label: '일정 관리' },
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
