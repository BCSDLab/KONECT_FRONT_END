import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';

export const useTransferManagedPresidentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.transferPresident(queryClient, clubId));
};

export const useChangeManagedVicePresidentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.changeVicePresident(queryClient, clubId));
};

export const useChangeManagedMemberPositionMutation = (
  clubId: number,
  { invalidateOnSuccess = true }: { invalidateOnSuccess?: boolean } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.changeMemberPosition(queryClient, clubId, { invalidateOnSuccess }));
};

export const useRemoveManagedMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.removeMember(queryClient, clubId));
};

export const useAddManagedPreMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.addPreMember(queryClient, clubId));
};

export const useDeleteManagedPreMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation(managedClubMutations.deletePreMember(queryClient, clubId));
};
