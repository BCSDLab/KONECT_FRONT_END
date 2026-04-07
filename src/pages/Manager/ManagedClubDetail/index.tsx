import { Link } from 'react-router-dom';
import BoyIcon from '@/assets/image/boy.png';
import ChatIcon from '@/assets/image/chat.png';
import FloderIcon from '@/assets/image/folder.png';
import ChevronRightDarkIcon from '@/assets/svg/Chevron-left-dark.svg';
import ManagerInfoCard from '@/pages/User/MyPage/components/ManagerInfoCard';

const menuItems = [
  { to: 'recruitment', icon: FloderIcon, size: 24, label: '모집 공고 및 지원서 관리' },
  { to: 'applications', icon: ChatIcon, size: 28, label: '지원자 관리' },
  { to: 'members', icon: BoyIcon, size: 28, label: '부원 관리' },
];

function ManagedClubDetail() {
  return (
    <div className="flex flex-col gap-9 px-4.75 py-4.25">
      <ManagerInfoCard type="detail" />
      <div className="border-background flex flex-col gap-5 rounded-2xl border bg-white px-4 py-3">
        {menuItems.map(({ to, icon, size, label }) => (
          <Link key={to} to={to} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={icon} alt="" width={size} height={size} />
              <span className="text-sub1 font-semibold text-indigo-700">{label}</span>
            </div>
            <ChevronRightDarkIcon />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ManagedClubDetail;
