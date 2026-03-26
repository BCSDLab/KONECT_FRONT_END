import { Link } from 'react-router-dom';
import NotificationsIcon from '@/assets/svg/notifications.svg';
import UnreadNotificationIcon from '@/assets/svg/unread-notification.svg';
import { useUnreadInboxNotificationCount } from '@/pages/Notifications/hooks/useInboxNotifications';

function NotificationBell() {
  const { unreadCount } = useUnreadInboxNotificationCount();

  return (
    <Link
      to="/notifications"
      aria-label={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개, 알림 목록 열기` : '알림 목록 열기'}
      className="inline-flex items-center justify-center"
    >
      {unreadCount > 0 ? <UnreadNotificationIcon /> : <NotificationsIcon />}
    </Link>
  );
}

export default NotificationBell;
