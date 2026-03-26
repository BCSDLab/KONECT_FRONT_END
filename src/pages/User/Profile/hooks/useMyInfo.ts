import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useUpdateMyInfoMutation } from '@/apis/auth/hooks';
import { authQueries } from '@/apis/auth/queries';
import type { ApiError } from '@/interface/error';

interface UseMyInfoOptions {
  onSuccess?: () => void;
}

export const useMyInfo = (options: UseMyInfoOptions = {}) => {
  const navigate = useNavigate();

  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());

  const { mutateAsync, error } = useUpdateMyInfoMutation();

  const modifyMyInfo = async (...args: Parameters<typeof mutateAsync>) => {
    await mutateAsync(...args);
    options.onSuccess?.();
    navigate(-1);
  };

  return {
    myInfo,
    modifyMyInfo,
    error: error as ApiError | null,
  };
};
