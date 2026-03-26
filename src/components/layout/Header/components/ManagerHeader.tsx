import { useLocation } from 'react-router-dom';
import { useManagedClub } from '@/pages/Manager/hooks/useManagedClubs';
import NotificationBell from './NotificationBell';
import SubpageHeader from './SubpageHeader';

function ManagerHeaderBase({ title }: { title: string }) {
  return (
    <SubpageHeader
      title={title}
      rightSlot={<NotificationBell />}
      shadowClassName="shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)]"
    />
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
