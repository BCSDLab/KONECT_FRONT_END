import { useLocation } from 'react-router-dom';
import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import NotificationBell from './NotificationBell';

function InfoHeader() {
  const { pathname } = useLocation();
  const { myInfo } = useMyInfo();
  const showChatTooltip = pathname === '/home';

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex items-center rounded-b-3xl bg-white px-4 pt-2 pb-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.05)]">
      <div className="flex flex-1 flex-col">
        <div className="text-h3 text-indigo-700">{myInfo.universityName}</div>
        <div className="text-cap1 text-indigo-300">
          {myInfo.name} {myInfo.studentNumber}
        </div>
      </div>
      <NotificationBell showTooltip={showChatTooltip} />
    </header>
  );
}

export default InfoHeader;
