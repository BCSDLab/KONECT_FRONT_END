import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import NotificationBell from './NotificationBell';

function InfoHeader() {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);
  const showChatTooltip = pathname === '/home';

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex items-center rounded-b-3xl bg-white px-4 pt-2 pb-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.05)]">
      <div className="flex flex-1 flex-col">
        {user ? (
          <>
            <div className="text-h3 text-indigo-700">{user.universityName}</div>
            <div className="text-cap1 text-indigo-300">
              {user.name} {user.studentNumber}
            </div>
          </>
        ) : (
          <>
            <div className="bg-indigo-25 mb-1 h-6 w-28 animate-pulse rounded" />
            <div className="bg-indigo-10 h-4 w-36 animate-pulse rounded" />
          </>
        )}
      </div>
      <NotificationBell showTooltip={showChatTooltip} />
    </header>
  );
}

export default InfoHeader;
