import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authMutations } from '@/apis/auth/mutations';
import { useAuthStore } from '@/stores/authStore';

export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const clearAuthAndNotifyNative = useAuthStore((state) => state.clearAuthAndNotifyNative);

  return useMutation({
    ...authMutations.logout(),
    onSuccess: () => {
      clearAuthAndNotifyNative();
      navigate('/');
    },
  });
};
