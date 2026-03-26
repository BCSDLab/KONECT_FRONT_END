import { useMutation } from '@tanstack/react-query';
import { signup } from '@/apis/auth';
import type { ApiError } from '@/interface/error';

export const useSignupMutation = () => {
  const mutation = useMutation({
    mutationFn: signup,
  });

  return {
    ...mutation,
    error: mutation.error as ApiError | null,
  };
};
