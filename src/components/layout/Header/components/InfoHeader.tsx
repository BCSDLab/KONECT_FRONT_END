import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import NotificationBell from './NotificationBell';

function InfoHeader() {
  const { myInfo } = useMyInfo();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex items-center bg-white px-3 py-2">
      <div className="flex flex-1 flex-col">
        <div className="text-h3 text-indigo-700">{myInfo.universityName}</div>
        <div className="text-cap1 text-indigo-300">
          {myInfo.name} {myInfo.studentNumber}
        </div>
      </div>
      <NotificationBell />
    </header>
  );
}

export default InfoHeader;
