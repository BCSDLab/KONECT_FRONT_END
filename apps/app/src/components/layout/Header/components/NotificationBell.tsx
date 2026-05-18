import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { notificationQueries } from '@/apis/notification/queries';
import NotificationsIcon from '@/assets/svg/notifications.svg';
import UnreadNotificationIcon from '@/assets/svg/unread-notification.svg';
import { useAuthStore } from '@/stores/authStore';

function NotificationBell() {
  const authStatus = useAuthStore((state) => state.authStatus);
  const { data } = useQuery({
    ...notificationQueries.inboxUnreadCount(),
    enabled: authStatus === 'authenticated',
    staleTime: 30_000,
  });
  const unreadCount = data?.unreadCount ?? 0;

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
