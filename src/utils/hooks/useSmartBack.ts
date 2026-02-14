import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useSmartBack() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const fromClubList = location.state?.from === 'clubList';

  return useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    let targetPath = '/home';
    let state: { from?: string } | undefined;

    if (pathname.startsWith('/chats/')) {
      targetPath = '/chats';
    } else if (pathname === '/chats') {
      targetPath = '/home';
    } else if (pathname.startsWith('/clubs/')) {
      const parts = pathname.split('/');
      const clubId = parts[2];

      if (clubId === 'search') {
        targetPath = '/clubs';
      } else if (parts[3] === 'applications' && parts.length === 4) {
        targetPath = `/clubs/${clubId}`;
      } else if (parts[3] === 'fee') {
        targetPath = `/clubs/${clubId}`;
      } else if (parts[3] === 'complete') {
        targetPath = `/clubs/${clubId}`;
      } else {
        targetPath = `/clubs`;
        if (fromClubList) {
          state = { from: 'clubDetail' };
        }
      }
    } else if (pathname === '/clubs') {
      targetPath = '/home';
    } else if (pathname.startsWith('/council/notice/')) {
      targetPath = '/council';
    } else if (pathname === '/council') {
      targetPath = '/home';
    } else if (pathname.startsWith('/mypage/manager/')) {
      const parts = pathname.split('/');
      const clubId = parts[3];

      if (parts[4] === 'info') {
        targetPath = `/mypage/manager/${clubId}`;
      } else if (parts[4] === 'recruitment') {
        targetPath = `/mypage/manager/${clubId}`;
      } else if (parts[4] === 'applications' && parts.length === 5) {
        targetPath = `/mypage/manager/${clubId}`;
      } else if (parts[4] === 'applications' && parts[5]) {
        targetPath = `/mypage/manager/${clubId}/applications`;
      } else if (parts[4] === 'members') {
        targetPath = `/mypage/manager/${clubId}`;
      } else {
        targetPath = `/mypage/manager`;
      }
    } else if (pathname === '/mypage/manager') {
      targetPath = '/mypage';
    } else if (pathname === '/mypage') {
      targetPath = '/home';
    } else if (pathname === '/profile') {
      targetPath = '/mypage';
    } else if (pathname === '/schedule') {
      targetPath = '/home';
    } else if (pathname === '/timer') {
      targetPath = '/home';
    } else if (pathname === '/home') {
      targetPath = '/home';
    }

    navigate(targetPath, { replace: true, state });
  }, [navigate, pathname, fromClubList]);
}
