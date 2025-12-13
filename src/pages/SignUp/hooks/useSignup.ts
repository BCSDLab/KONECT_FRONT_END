import { useMutation } from '@tanstack/react-query';
import { postSignup } from '@/apis/auth';

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: postSignup,
  });
};
