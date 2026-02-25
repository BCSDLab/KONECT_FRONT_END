import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/apis/auth';
import { useAuthStore } from '@/stores/authStore';

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      try {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGOUT' }));
        }
      } catch {
        // 브릿지 전달 실패가 로그아웃 흐름을 중단시키지 않도록 무시
      }
      clearAuth();
      navigate('/');
    },
  });
};
