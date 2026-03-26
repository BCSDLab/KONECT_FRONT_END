import { useMutation, useQueryClient } from '@tanstack/react-query';
import { managedClubMutations } from './managedMutations';
import { managedClubQueryKeys } from './managedQueries';
import { clubQueryKeys } from './queries';

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

export const useChangeManagedMemberPositionMutation = (
  clubId: number,
  { invalidateOnSuccess = true }: { invalidateOnSuccess?: boolean } = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...managedClubMutations.changeMemberPosition(clubId),
    onSuccess: async () => {
      if (invalidateOnSuccess) {
        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
      }
    },
  });
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
