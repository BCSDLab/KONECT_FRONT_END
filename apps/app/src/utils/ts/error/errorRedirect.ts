export { isServerErrorStatus } from '@konect/utils/api-error';

export const SERVER_ERROR_PATH = '/server-error';

export function redirectToServerErrorPage(): void {
  if (typeof window === 'undefined') return;
  if (window.location.pathname === SERVER_ERROR_PATH) return;

  window.location.replace(SERVER_ERROR_PATH);
}
