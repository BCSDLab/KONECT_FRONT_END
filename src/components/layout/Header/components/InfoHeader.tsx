import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import NotificationBell from './NotificationBell';

function InfoHeader() {
  const { myInfo } = useMyInfo();

  return (
    <header
      className="fixed top-0 right-0 left-0 flex items-center bg-white px-3 py-2"
      style={{ paddingTop: 'calc(var(--sat) + 8px)', height: 'calc(var(--header-h) + var(--sat))' }}
    >
      <div className="flex flex-1 flex-col gap-1">
        <div className="text-sm leading-4 font-semibold text-indigo-700">{myInfo.universityName}</div>
        <div className="text-[10px] leading-3 text-indigo-300">
          {myInfo.name} {myInfo.studentNumber}
        </div>
      </div>
      <NotificationBell />
    </header>
  );
}

export default InfoHeader;
