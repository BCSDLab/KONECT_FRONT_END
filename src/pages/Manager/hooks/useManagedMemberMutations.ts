import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from '@/apis/club/managedMutations';
import { managedClubQueryKeys } from '@/apis/club/managedQueries';

export const useTransferManagedPresidentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.transferPresident(clubId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.club(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.clubs() }),
      ]);
    },
  });
};

export const useChangeManagedVicePresidentMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.changeVicePresident(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
    },
  });
};

export const useChangeManagedMemberPositionMutation = (clubId: number) => {
  return useMutation(managedClubMutations.changeMemberPosition(clubId));
};

export const useRemoveManagedMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.removeMember(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
    },
  });
};

export const useAddManagedPreMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.addPreMember(clubId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) }),
        queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.preMembers(clubId) }),
      ]);
    },
  });
};

export const useDeleteManagedPreMemberMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.deletePreMember(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.preMembers(clubId) });
    },
  });
};

export const useUpsertManagedClubSheetMutation = (clubId: number) => {
  return useMutation(managedClubMutations.upsertSheet(clubId));
};
