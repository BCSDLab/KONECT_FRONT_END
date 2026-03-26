import { useQuery } from '@tanstack/react-query';
import { getSignupPrefill } from '@/apis/auth';

export const useSignupPrefill = () => {
  return useQuery({
    queryKey: ['signup', 'prefill'],
    queryFn: getSignupPrefill,
  });
};
