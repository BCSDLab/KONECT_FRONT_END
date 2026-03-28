import { useEffect, useEffectEvent, useRef } from 'react';
import { refreshAccessToken } from '@/apis/auth';
import type { InboxNotification } from '@/apis/notification/entity';
import { useAuthStore } from '@/stores/authStore';
import { getAccessTokenExpirationTime } from '@/utils/ts/accessToken';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/errorRedirect';
import { NORMALIZED_API_BASE_URL } from '@/utils/ts/oauth';

const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;
const NOTIFICATION_STREAM_RECONNECT_DELAY = 3_000;

function isInboxNotification(value: unknown): value is InboxNotification {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const notification = value as Partial<InboxNotification>;

  return (
    typeof notification.id === 'number' &&
    typeof notification.type === 'string' &&
    typeof notification.title === 'string' &&
    typeof notification.body === 'string' &&
    typeof notification.path === 'string' &&
    typeof notification.isRead === 'boolean' &&
    typeof notification.createdAt === 'string'
  );
}

function extractInboxNotificationPayload(payload: unknown): InboxNotification | null {
  if (isInboxNotification(payload)) {
    return payload;
  }

  if (typeof payload !== 'object' || payload === null || !('notification' in payload)) {
    return null;
  }

  const nestedNotification = payload.notification;

  return isInboxNotification(nestedNotification) ? nestedNotification : null;
}

function parseSseEvent(chunk: string): { event: string | null; data: string | null } {
  const lines = chunk.split(/\r?\n/);
  let event: string | null = null;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trimStart();
    } else if (line.startsWith('data:')) {
      dataLines.push(line.slice(5).trimStart());
    }
  }

  return {
    event,
    data: dataLines.length > 0 ? dataLines.join('\n').trim() : null,
  };
}

function syncAccessTokenToNative(accessToken: string) {
  try {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TOKEN_REFRESH', accessToken }));
    }
  } catch {
    // 브릿지 전달 실패가 인증 흐름을 중단시키지 않도록 무시
  }
}

async function openInboxNotificationStream(
  signal: AbortSignal,
  onConnected: () => void,
  onNotification: (notification: InboxNotification) => void
) {
  let lastUnauthorizedAccessToken: string | null = null;

  while (!signal.aborted) {
    const accessToken = useAuthStore.getState().getAccessToken();

    if (!accessToken) {
      return;
    }

    const response = await fetch(`${NORMALIZED_API_BASE_URL}/notifications/inbox/stream`, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
      credentials: 'include',
      signal,
    });

    if (response.status === 401) {
      if (lastUnauthorizedAccessToken === accessToken) {
        useAuthStore.getState().clearAuth();
        throw new Error('인증이 만료되었습니다.');
      }

      lastUnauthorizedAccessToken = accessToken;

      try {
        const nextAccessToken = await refreshAccessToken();
        useAuthStore.getState().setAccessToken(nextAccessToken);
        syncAccessTokenToNative(nextAccessToken);
      } catch {
        useAuthStore.getState().clearAuth();
        throw new Error('인증이 만료되었습니다.');
      }

      continue;
    }

    lastUnauthorizedAccessToken = null;

    if (isServerErrorStatus(response.status)) {
      redirectToServerErrorPage();
      throw new Error('알림 스트림 연결 중 서버 오류가 발생했습니다.');
    }

    if (!response.ok) {
      throw new Error(`알림 스트림 연결에 실패했습니다. (${response.status})`);
    }

    const reader = response.body?.getReader();

    if (!reader) {
      return;
    }

    onConnected();

    const decoder = new TextDecoder();
    let buffer = '';

    while (!signal.aborted) {
      const { done, value } = await reader.read();

      if (done) {
        buffer += decoder.decode();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const eventChunks = buffer.split(/\r?\n\r?\n/);
      buffer = eventChunks.pop() ?? '';

      for (const eventChunk of eventChunks) {
        const { event: eventType, data: eventData } = parseSseEvent(eventChunk);

        if (!eventData || eventType === 'connect') {
          continue;
        }

        try {
          const parsedPayload = JSON.parse(eventData) as unknown;
          const notification = extractInboxNotificationPayload(parsedPayload);

          if (notification) {
            onNotification(notification);
          }
        } catch {
          continue;
        }
      }
    }

    if (!signal.aborted) {
      await new Promise((resolve) => setTimeout(resolve, NOTIFICATION_STREAM_RECONNECT_DELAY));
    }
  }
}

interface UseInboxNotificationStreamOptions {
  onReconnect?: () => void;
}

export function useInboxNotificationStream(
  onNotification: (notification: InboxNotification) => void,
  options: UseInboxNotificationStreamOptions = {}
) {
  const authStatus = useAuthStore((state) => state.authStatus);
  const accessToken = useAuthStore((state) => state.accessToken);
  const hasEstablishedConnectionRef = useRef(false);
  const handleNotification = useEffectEvent(onNotification);
  const handleReconnect = useEffectEvent(options.onReconnect ?? (() => {}));

  useEffect(() => {
    if (authStatus === 'authenticated') {
      return;
    }

    hasEstablishedConnectionRef.current = false;
  }, [authStatus]);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !accessToken) {
      return;
    }

    const expirationTime = getAccessTokenExpirationTime(accessToken);

    if (expirationTime === null) {
      return;
    }

    const refreshDelay = Math.max(expirationTime - Date.now() - ACCESS_TOKEN_REFRESH_BUFFER_MS, 0);
    let isCancelled = false;

    const refreshAccessTokenBeforeExpiry = async () => {
      if (useAuthStore.getState().getAccessToken() !== accessToken) {
        return;
      }

      try {
        const nextAccessToken = await refreshAccessToken();

        if (isCancelled || useAuthStore.getState().getAccessToken() !== accessToken) {
          return;
        }

        useAuthStore.getState().setAccessToken(nextAccessToken);
        syncAccessTokenToNative(nextAccessToken);
      } catch {
        if (isCancelled || useAuthStore.getState().getAccessToken() !== accessToken) {
          return;
        }

        useAuthStore.getState().clearAuth();
      }
    };

    const refreshTimeoutId = window.setTimeout(() => {
      void refreshAccessTokenBeforeExpiry();
    }, refreshDelay);

    return () => {
      isCancelled = true;
      window.clearTimeout(refreshTimeoutId);
    };
  }, [accessToken, authStatus]);

  useEffect(() => {
    if (authStatus !== 'authenticated' || !accessToken || !NORMALIZED_API_BASE_URL) {
      return;
    }

    let reconnectTimeoutId: number | null = null;
    const abortController = new AbortController();

    const handleConnected = () => {
      if (hasEstablishedConnectionRef.current) {
        handleReconnect();
        return;
      }

      hasEstablishedConnectionRef.current = true;
    };

    const connect = async () => {
      try {
        await openInboxNotificationStream(abortController.signal, handleConnected, handleNotification);
      } catch {
        if (abortController.signal.aborted) {
          return;
        }
      }

      if (abortController.signal.aborted) {
        return;
      }

      reconnectTimeoutId = window.setTimeout(() => {
        void connect();
      }, NOTIFICATION_STREAM_RECONNECT_DELAY);
    };

    void connect();

    return () => {
      abortController.abort();

      if (reconnectTimeoutId !== null) {
        window.clearTimeout(reconnectTimeoutId);
      }
    };
  }, [accessToken, authStatus]);
}
