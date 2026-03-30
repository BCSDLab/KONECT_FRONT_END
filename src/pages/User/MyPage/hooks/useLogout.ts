import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authMutations } from '@/apis/auth/mutations';
import { useAuthStore } from '@/stores/authStore';

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      clearAuth();
      navigate('/');
    },
  });
};
