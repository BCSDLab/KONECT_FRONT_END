import type { Ref } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import NotificationBell from './NotificationBell';
import SubpageHeader from './SubpageHeader';

function ManagerHeaderBase({ title, headerRef }: { title: string; headerRef?: Ref<HTMLElement> }) {
  return (
    <SubpageHeader
      title={title}
      headerRef={headerRef}
      rightSlot={<NotificationBell />}
      shadowClassName="shadow-[0px_2px_2px_0px_rgba(0,0,0,0.05)]"
    />
  );
}

function ManagerHeaderWithClub({ clubId, headerRef }: { clubId: number; headerRef?: Ref<HTMLElement> }) {
  const { data: managedClub } = useSuspenseQuery(managedClubQueries.club(clubId));
  return <ManagerHeaderBase title={managedClub.clubName} headerRef={headerRef} />;
}

function ManagerHeader({ fallbackTitle, headerRef }: { fallbackTitle: string; headerRef?: Ref<HTMLElement> }) {
  const { pathname } = useLocation();
  const match = pathname.match(/^\/mypage\/manager\/(\d+)$/);

  if (match) {
    return <ManagerHeaderWithClub clubId={Number(match[1])} headerRef={headerRef} />;
  }

  return <ManagerHeaderBase title={fallbackTitle} headerRef={headerRef} />;
}

export default ManagerHeader;
