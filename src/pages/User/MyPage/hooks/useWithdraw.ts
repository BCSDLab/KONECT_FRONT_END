import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteMyAccount } from '@/apis/auth';
import { useAuthStore } from '@/stores/authStore';

export const useWithdrawMutation = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      clearAuth();
      navigate('/');
    },
  });
};
