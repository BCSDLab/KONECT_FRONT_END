import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authMutations } from '@/apis/auth/mutations';
import { useAuthStore } from '@/stores/authStore';

export const useWithdrawMutation = () => {
  const navigate = useNavigate();
  const clearAuthAndNotifyNative = useAuthStore((state) => state.clearAuthAndNotifyNative);

  return useMutation({
    ...authMutations.withdraw(),
    onSuccess: () => {
      clearAuthAndNotifyNative();
      navigate('/');
    },
  });
};
