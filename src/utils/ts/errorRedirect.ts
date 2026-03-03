export const SERVER_ERROR_PATH = '/server-error';

export function isServerErrorStatus(status: number): boolean {
  return status >= 500 && status < 600;
}

export function redirectToServerErrorPage(): void {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === SERVER_ERROR_PATH) return;

  window.location.replace(SERVER_ERROR_PATH);
}
