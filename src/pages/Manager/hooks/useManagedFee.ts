import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getBanks, getClubFee, putClubFee } from '@/apis/club';
import type { ClubFeeRequest } from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';

const feeQueryKeys = {
  all: ['manager'],
  banks: () => [...feeQueryKeys.all, 'banks'],
  managedClubFee: (clubId: number) => [...feeQueryKeys.all, 'managedClubFee', clubId],
};

export const useGetBanks = () => {
  const { data: banks } = useSuspenseQuery({
    queryKey: feeQueryKeys.banks(),
    queryFn: getBanks,
  });

  return { banks };
};

export const useManagedClubFee = (clubId: number) => {
  const { data: managedClubFee } = useSuspenseQuery({
    queryKey: feeQueryKeys.managedClubFee(clubId),
    queryFn: () => getClubFee(clubId),
  });

  return { managedClubFee };
};

export const useManagedClubFeeMutation = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: feeQueryKeys.managedClubFee(clubId),
    mutationFn: (data: ClubFeeRequest) => putClubFee(clubId, data),
    onSuccess: () => {
      showToast('회비가 수정되었습니다');
      queryClient.invalidateQueries({ queryKey: feeQueryKeys.managedClubFee(clubId) });
      navigate(-1);
    },
  });
};
