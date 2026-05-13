import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';
import { managedClubQueryKeys } from '@/apis/club/managedQueries';
import { clubQueryKeys } from '@/apis/club/queries';

export const useUpdateManagedClubInfoMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.updateInfo(clubId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.club(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.clubs() }),
      ]);
    },
  });
};

export const useUpdateManagedClubFeeMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.updateFee(clubId),
    onSuccess: async (updatedFee) => {
      queryClient.setQueryData(managedClubQueryKeys.fee(clubId), updatedFee);
      queryClient.setQueryData(clubQueryKeys.fee(clubId), updatedFee);

      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) });
    },
  });
};

export const useUpsertManagedClubRecruitmentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.upsertRecruitment(clubId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) }),
        queryClient.invalidateQueries({ queryKey: clubQueryKeys.recruitment(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.recruitment(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) }),
      ]);
    },
  });
};

export const useUpdateManagedClubQuestionsMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.updateQuestions(clubId),
    onSuccess: async (updatedQuestions) => {
      queryClient.setQueryData(managedClubQueryKeys.questions(clubId), updatedQuestions);
      queryClient.setQueryData(clubQueryKeys.questions(clubId), updatedQuestions);

      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) });
    },
  });
};

export const usePatchManagedClubSettingsMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.patchSettings(clubId),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(managedClubQueryKeys.settings(clubId), updatedSettings);
    },
  });
};
