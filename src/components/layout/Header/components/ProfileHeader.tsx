import type { Ref } from 'react';
import NotificationBell from './NotificationBell';

function ProfileHeader({ headerRef }: { headerRef?: Ref<HTMLElement> }) {
  return (
    <header
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-30 flex h-11 min-h-[63px] items-center justify-end rounded-b-3xl bg-white px-4 py-2 pt-2 pb-3 shadow-[0_2px_2px_0_rgba(0,0,0,0.05)]"
    >
      <NotificationBell />
    </header>
  );
}

export default ProfileHeader;
