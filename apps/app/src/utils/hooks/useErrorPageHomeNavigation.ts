import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function useErrorPageHomeNavigation() {
  const navigate = useNavigate();
  const authStatus = useAuthStore((state) => state.authStatus);

  return () => {
    navigate(authStatus === 'authenticated' ? '/home' : '/', { replace: true });
  };
}
