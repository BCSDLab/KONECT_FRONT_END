import { Link } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';

const menuItems = [
  { to: 'write', icon: FileSearchIcon, label: '모집 공고 관리' },
  { to: 'form', icon: FileIcon, label: '지원서 양식 관리' },
  { to: 'account', icon: FileIcon, label: '계좌 관리' },
];

function ManagedRecruitment() {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
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

export default ManagedRecruitment;
