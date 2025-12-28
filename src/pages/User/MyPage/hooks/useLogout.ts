import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/apis/auth';

export const useLogoutMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate('/');
    },
  });
};
