import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getManagedClubs, getManagedClub, putClubInfo } from '@/apis/club';
import type { ClubInfoRequest } from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

const managerClubQueryKeys = {
  all: ['manager'],
  managedClubs: () => [...managerClubQueryKeys.all, 'managedClubs'],
  managedClub: (clubId: number) => [...managerClubQueryKeys.all, 'managedClub', clubId],
  managedClubInfo: (clubId: number) => [...managerClubQueryKeys.all, 'managedClubInfo', clubId],
};

export const useGetManagedClubs = () => {
  const { data: managedClubList } = useSuspenseQuery({
    queryKey: managerClubQueryKeys.managedClubs(),
    queryFn: getManagedClubs,
  });

  return { managedClubList };
};

export const useManagedClub = (clubId: number) => {
  const { data: managedClub } = useSuspenseQuery({
    queryKey: managerClubQueryKeys.managedClub(clubId),
    queryFn: () => getManagedClub(clubId),
  });

  return { managedClub };
};

export const useUpdateClubInfo = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: managerClubQueryKeys.managedClubInfo(clubId),
    mutationFn: (data: ClubInfoRequest) => putClubInfo(clubId, data),
    onSuccess: () => {
      showToast('클럽 정보가 수정되었습니다');
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      navigate(-1);
    },
  });
};
