import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatQueries } from '@/apis/chat/queries';
import { useAuthStore } from '@/stores/authStore';

const UNREAD_CHAT_COUNT_REFETCH_INTERVAL = 5_000;

function useUnreadChatCount() {
  const [isEnabled, setIsEnabled] = useState(false);
  const authStatus = useAuthStore((state) => state.authStatus);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const requestIdleCallback = window.requestIdleCallback;

    if (typeof requestIdleCallback === 'function') {
      const idleCallbackId = requestIdleCallback(() => {
        setIsEnabled(true);
      });

      return () => {
        window.cancelIdleCallback(idleCallbackId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      setIsEnabled(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const { data } = useQuery({
    ...chatQueries.rooms(),
    enabled: isEnabled && authStatus === 'authenticated',
    staleTime: UNREAD_CHAT_COUNT_REFETCH_INTERVAL,
    refetchInterval: isEnabled && authStatus === 'authenticated' ? UNREAD_CHAT_COUNT_REFETCH_INTERVAL : false,
  });

  const totalUnreadCount = data?.rooms.reduce((sum, room) => sum + room.unreadCount, 0) ?? 0;

  return {
    totalUnreadCount,
  };
}

export default useUnreadChatCount;
