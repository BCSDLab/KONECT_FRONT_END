import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';
import { managedClubQueryKeys } from '@/apis/club/managedQueries';

export const useApproveManagedApplicationMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.approveApplication(clubId),
    onSuccess: async (_, applicationId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applications(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applicationDetail(clubId, applicationId) }),
      ]);
    },
  });
};

export const useRejectManagedApplicationMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.rejectApplication(clubId),
    onSuccess: async (_, applicationId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applications(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applicationDetail(clubId, applicationId) }),
      ]);
    },
  });
};
