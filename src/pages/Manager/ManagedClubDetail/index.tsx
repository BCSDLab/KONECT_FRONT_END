import { Link } from 'react-router-dom';
import AssignmentIcon from '@/assets/svg/assignment-icon.svg';
import ChevronRightDarkIcon from '@/assets/svg/Chevron-left-dark.svg';
import InkIcon from '@/assets/svg/ink-icon.svg';
import PersonIcon from '@/assets/svg/person-icon.svg';
import ManagerInfoCard from '@/pages/User/MyPage/components/ManagerInfoCard';

const menuItems = [
  { to: 'recruitment', icon: AssignmentIcon, label: '모집 공고 및 지원서 관리' },
  { to: 'applications', icon: InkIcon, label: '지원자 관리' },
  { to: 'members', icon: PersonIcon, label: '부원 관리' },
];

function ManagedClubDetail() {
  return (
    <div className="flex flex-col gap-9 px-4.75 py-4.25">
      <ManagerInfoCard type="detail" />
      <div className="border-background flex flex-col gap-5 rounded-2xl border bg-white px-4 py-3">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-text-100 flex size-10 items-center justify-center rounded-[10px]">
                <Icon />
              </div>
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
