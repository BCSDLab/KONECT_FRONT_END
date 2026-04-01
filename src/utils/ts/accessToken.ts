interface AccessTokenPayload {
  exp?: number;
}

export const getAccessTokenExpirationTime = (accessToken: string | null): number | null => {
  if (!accessToken) return null;

  const [, payload] = accessToken.split('.');
  if (!payload) return null;

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
    const parsedPayload = JSON.parse(atob(`${normalizedPayload}${padding}`)) as AccessTokenPayload;

    return typeof parsedPayload.exp === 'number' ? parsedPayload.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const isAccessTokenExpired = (accessToken: string | null, now: number = Date.now()) => {
  const expirationTime = getAccessTokenExpirationTime(accessToken);

  return expirationTime === null || expirationTime <= now;
};
