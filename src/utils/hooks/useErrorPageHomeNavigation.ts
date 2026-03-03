import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

export function useErrorPageHomeNavigation() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return () => {
    navigate(isAuthenticated ? '/home' : '/', { replace: true });
  };
}
