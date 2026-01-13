import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyInfo, putMyInfo } from '@/apis/auth';
import type { ModifyMyInfoRequest } from '@/apis/auth/entity';
import type { ApiError } from '@/interface/error';

export const useMyInfo = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: myInfo } = useSuspenseQuery({
    queryKey: ['myInfo'],
    queryFn: () => getMyInfo(),
  });

  const { mutateAsync: modifyMyInfo, error } = useMutation({
    mutationKey: ['modifyMyInfo'],
    mutationFn: (data: ModifyMyInfoRequest) => putMyInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      navigate(-1);
    },
  });

  return {
    myInfo,
    modifyMyInfo,
    error: error as ApiError | null,
  };
};
