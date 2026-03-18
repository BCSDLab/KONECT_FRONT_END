import { useLocation } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { useManagedClub } from '@/pages/Manager/hooks/useManagedClubs';
import { useSmartBack } from '@/utils/hooks/useSmartBack';
import NotificationBell from './NotificationBell';

function ManagerHeaderBase({ title }: { title: string }) {
  const smartBack = useSmartBack();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex items-center justify-between rounded-b-3xl bg-white px-4 py-3 shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-1">
        <button type="button" aria-label="뒤로가기" onClick={smartBack}>
          <ChevronLeftIcon />
        </button>
        <span className="text-sub1 text-indigo-700">{title}</span>
      </div>
      <NotificationBell />
    </header>
  );
}

function ManagerHeaderWithClub({ clubId }: { clubId: number }) {
  const { managedClub } = useManagedClub(clubId);
  return <ManagerHeaderBase title={managedClub.clubName} />;
}

function ManagerHeader({ fallbackTitle }: { fallbackTitle: string }) {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/mypage\/manager\/(\d+)$/);

  if (match) {
    return <ManagerHeaderWithClub clubId={Number(match[1])} />;
  }

  return <ManagerHeaderBase title={fallbackTitle} />;
}

export default ManagerHeader;
