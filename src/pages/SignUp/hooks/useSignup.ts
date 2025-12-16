import { useMutation } from '@tanstack/react-query';
import { postSignup } from '@/apis/auth';
import type { ApiError } from '@/apis/client';

export const useSignupMutation = () => {
  const mutation = useMutation({
    mutationFn: postSignup,
  });

  return {
    ...mutation,
    error: mutation.error as ApiError | null,
  };
};
