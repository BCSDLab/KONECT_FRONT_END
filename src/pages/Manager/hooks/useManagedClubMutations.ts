import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';

export const useUpdateManagedClubInfoMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.updateInfo(queryClient, clubId));
};

export const useUpdateManagedClubFeeMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.updateFee(queryClient, clubId));
};

export const useUpsertManagedClubRecruitmentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.upsertRecruitment(queryClient, clubId));
};

export const useUpdateManagedClubQuestionsMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.updateQuestions(queryClient, clubId));
};

export const usePatchManagedClubSettingsMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.patchSettings(queryClient, clubId));
};
