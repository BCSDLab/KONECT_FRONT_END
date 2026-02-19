import NotificationBell from './NotificationBell';

function ProfileHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-11 items-center justify-end bg-white px-4 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]">
      <NotificationBell />
    </header>
  );
}

export default ProfileHeader;
