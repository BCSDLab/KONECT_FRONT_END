import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { deleteMyAccount } from '@/apis/auth';

export const useWithdrawMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      navigate('/');
    },
  });
};
