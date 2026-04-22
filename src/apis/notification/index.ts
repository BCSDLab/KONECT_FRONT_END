import { apiClient } from '@/apis/client';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from '@/apis/notification/entity';
import { hasNativeBridge } from '@/utils/ts/nativeBridge';

export const registerPushToken = async (token: string) => {
  if (hasNativeBridge()) {
    if (import.meta.env.DEV) {
      console.log('RN WebView 환경: 웹에서 푸시 토큰 등록 생략 (네이티브가 처리)');
    }
    return;
  }

  const response = await apiClient.post('notifications/tokens', {
    body: { token },
    requiresAuth: true,
  });
  return response;
};

export const getNotificationToken = async (): Promise<{ token: string }> => {
  const response = await apiClient.get<{ token: string }>('notifications/tokens', {
    requiresAuth: true,
  });
  return response;
};

export const getInboxNotifications = async (page = 1): Promise<InboxNotificationListResponse> => {
  const response = await apiClient.get<InboxNotificationListResponse>('notifications/inbox', {
    params: { page },
    requiresAuth: true,
  });
  return response;
};

export const getInboxUnreadCount = async (): Promise<InboxNotificationUnreadCountResponse> => {
  const response = await apiClient.get<InboxNotificationUnreadCountResponse>('notifications/inbox/unread-count', {
    requiresAuth: true,
  });
  return response;
};

export const markInboxNotificationAsRead = async (notificationId: number) => {
  const response = await apiClient.patch(`notifications/inbox/${notificationId}/read`, {
    requiresAuth: true,
  });
  return response;
};
