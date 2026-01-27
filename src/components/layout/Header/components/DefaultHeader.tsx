import { useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import NotificationBell from './NotificationBell';

interface DefaultHeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotificationBell?: boolean;
  onBack?: () => void;
}

function DefaultHeader({ title, showBackButton = true, showNotificationBell = false, onBack }: DefaultHeaderProps) {
  const navigate = useNavigate();

  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2">
      {showBackButton && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={handleBack}
          className="absolute top-1/2 left-4 -translate-y-1/2"
        >
          <ChevronLeftIcon />
        </button>
      )}
      <span className="text-lg">{title}</span>
      {showNotificationBell && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2">
          <NotificationBell />
        </div>
      )}
    </header>
  );
}

export default DefaultHeader;
