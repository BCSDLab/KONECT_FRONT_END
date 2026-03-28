import type { ApiError } from '@/interface/error';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/errorRedirect';
import { NORMALIZED_API_BASE_URL } from '@/utils/ts/oauth';
import { apiClient } from '../client';
import type {
  ModifyMyInfoRequest,
  MyInfoResponse,
  OAuthLinksResponse,
  RefreshTokenResponse,
  SignupRequest,
} from './entity';

let refreshAccessTokenPromise: Promise<string> | null = null;

const requestAccessTokenRefresh = async (): Promise<string> => {
  const url = `${NORMALIZED_API_BASE_URL}/users/refresh`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (err) {
    if (err instanceof TypeError) {
      const networkError = new Error('네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.') as ApiError;
      networkError.name = 'NetworkError';
      networkError.status = 0;
      networkError.statusText = 'NETWORK_ERROR';
      networkError.url = url;
      throw networkError;
    }
    throw err as Error;
  }

  if (!response.ok) {
    if (isServerErrorStatus(response.status)) {
      redirectToServerErrorPage();
      throw new Error('서버 오류가 발생했습니다.');
    }

    const error = new Error('토큰 갱신 실패') as ApiError;
    error.name = 'TokenRefreshError';
    error.status = response.status;
    error.statusText = response.statusText;
    error.url = url;
    throw error;
  }

  const data: RefreshTokenResponse = await response.json();
  return data.accessToken;
};

export const refreshAccessToken = async (): Promise<string> => {
  if (!refreshAccessTokenPromise) {
    refreshAccessTokenPromise = requestAccessTokenRefresh().finally(() => {
      refreshAccessTokenPromise = null;
    });
  }

  return refreshAccessTokenPromise;
};

export const signup = async (data: SignupRequest) => {
  const response = await apiClient.post('users/signup', {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const getMyInfo = async () => {
  const response = await apiClient.get<MyInfoResponse>('users/me', {
    requiresAuth: true,
  });
  return response;
};

export const getMyOAuthLinks = async () => {
  const response = await apiClient.get<OAuthLinksResponse>('users/me/oauth/links', {
    requiresAuth: true,
  });
  return response;
};

export const logout = async () => {
  const response = await apiClient.post('users/logout', {
    requiresAuth: true,
  });
  return response;
};

export const putMyInfo = async (data: ModifyMyInfoRequest) => {
  const response = await apiClient.put('users/me', {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const deleteMyAccount = async () => {
  const response = await apiClient.delete('users/withdraw', {
    requiresAuth: true,
  });
  return response;
};

export const getSignupPrefill = async (): Promise<{ name: string } | null> => {
  try {
    const response = await apiClient.get<{ name: string }>('users/signup/prefill');
    return response;
  } catch {
    return null;
  }
};
