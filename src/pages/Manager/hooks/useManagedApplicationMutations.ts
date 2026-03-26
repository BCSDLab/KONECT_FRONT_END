import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';

export const useApproveManagedApplicationMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.approveApplication(queryClient, clubId));
};

export const useRejectManagedApplicationMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.rejectApplication(queryClient, clubId));
};
