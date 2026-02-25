import { apiClient } from '../client';

export const registerPushToken = async (token: string) => {
  if (window.ReactNativeWebView) {
    console.log('RN WebView 환경: 웹에서 푸시 토큰 등록 생략 (네이티브가 처리)');
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
