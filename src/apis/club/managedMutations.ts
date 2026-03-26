import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { managedClubQueryKeys } from './managedQueries';
import { clubQueryKeys } from './queries';
import type {
  AddPreMemberRequest,
  ChangeMemberPositionRequest,
  ChangeVicePresidentRequest,
  ClubFeeRequest,
  ClubInfoRequest,
  ClubQuestionsRequest,
  ClubRecruitmentRequest,
  ClubSettingsPatchRequest,
  TransferPresidentRequest,
} from './entity';
import {
  deleteMember,
  deletePreMember,
  patchClubSettings,
  patchMemberPosition,
  patchVicePresident,
  postAddPreMember,
  postClubApplicationApprove,
  postClubApplicationReject,
  postTransferPresident,
  putClubFee,
  putClubInfo,
  putClubQuestions,
  putClubRecruitment,
} from '.';

export const managedClubMutationKeys = {
  updateInfo: (clubId: number) => ['clubs', 'managed', 'updateInfo', clubId] as const,
  updateFee: (clubId: number) => ['clubs', 'managed', 'updateFee', clubId] as const,
  upsertRecruitment: (clubId: number) => ['clubs', 'managed', 'upsertRecruitment', clubId] as const,
  updateQuestions: (clubId: number) => ['clubs', 'managed', 'updateQuestions', clubId] as const,
  patchSettings: (clubId: number) => ['clubs', 'managed', 'patchSettings', clubId] as const,
  approveApplication: (clubId: number) => ['clubs', 'managed', 'approveApplication', clubId] as const,
  rejectApplication: (clubId: number) => ['clubs', 'managed', 'rejectApplication', clubId] as const,
  transferPresident: (clubId: number) => ['clubs', 'managed', 'transferPresident', clubId] as const,
  changeVicePresident: (clubId: number) => ['clubs', 'managed', 'changeVicePresident', clubId] as const,
  changeMemberPosition: (clubId: number) => ['clubs', 'managed', 'changeMemberPosition', clubId] as const,
  removeMember: (clubId: number) => ['clubs', 'managed', 'removeMember', clubId] as const,
  addPreMember: (clubId: number) => ['clubs', 'managed', 'addPreMember', clubId] as const,
  deletePreMember: (clubId: number) => ['clubs', 'managed', 'deletePreMember', clubId] as const,
};

export const managedClubMutations = {
  updateInfo: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateInfo(clubId),
      mutationFn: (data: ClubInfoRequest) => putClubInfo(clubId, data),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.club(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.clubs() }),
        ]);
      },
    }),
  updateFee: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateFee(clubId),
      mutationFn: (data: ClubFeeRequest) => putClubFee(clubId, data),
      onSuccess: async (updatedFee) => {
        queryClient.setQueryData(managedClubQueryKeys.fee(clubId), updatedFee);
        queryClient.setQueryData(clubQueryKeys.fee(clubId), updatedFee);

        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) });
      },
    }),
  upsertRecruitment: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.upsertRecruitment(clubId),
      mutationFn: (data: ClubRecruitmentRequest) => putClubRecruitment(clubId, data),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) }),
          queryClient.invalidateQueries({ queryKey: clubQueryKeys.recruitment(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.recruitment(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) }),
        ]);
      },
    }),
  updateQuestions: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateQuestions(clubId),
      mutationFn: (data: ClubQuestionsRequest) => putClubQuestions(clubId, data),
      onSuccess: async (updatedQuestions) => {
        queryClient.setQueryData(managedClubQueryKeys.questions(clubId), updatedQuestions);
        queryClient.setQueryData(clubQueryKeys.questions(clubId), updatedQuestions);

        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.settings(clubId) });
      },
    }),
  patchSettings: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.patchSettings(clubId),
      mutationFn: (data: ClubSettingsPatchRequest) => patchClubSettings(clubId, data),
      onSuccess: (updatedSettings) => {
        queryClient.setQueryData(managedClubQueryKeys.settings(clubId), updatedSettings);
      },
    }),
  approveApplication: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.approveApplication(clubId),
      mutationFn: (applicationId: number) => postClubApplicationApprove(clubId, applicationId),
      onSuccess: async (_, applicationId) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applications(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applicationDetail(clubId, applicationId) }),
        ]);
      },
    }),
  rejectApplication: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.rejectApplication(clubId),
      mutationFn: (applicationId: number) => postClubApplicationReject(clubId, applicationId),
      onSuccess: async (_, applicationId) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applications(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.applicationDetail(clubId, applicationId) }),
        ]);
      },
    }),
  transferPresident: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.transferPresident(clubId),
      mutationFn: (data: TransferPresidentRequest) => postTransferPresident(clubId, data),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.club(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.clubs() }),
        ]);
      },
    }),
  changeVicePresident: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.changeVicePresident(clubId),
      mutationFn: (data: ChangeVicePresidentRequest) => patchVicePresident(clubId, data),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
      },
    }),
  changeMemberPosition: (
    queryClient: QueryClient,
    clubId: number,
    { invalidateOnSuccess = true }: { invalidateOnSuccess?: boolean } = {}
  ) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.changeMemberPosition(clubId),
      mutationFn: ({ userId, data }: { data: ChangeMemberPositionRequest; userId: number }) =>
        patchMemberPosition(clubId, userId, data),
      onSuccess: async () => {
        if (invalidateOnSuccess) {
          await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
        }
      },
    }),
  removeMember: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.removeMember(clubId),
      mutationFn: (userId: number) => deleteMember(clubId, userId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
      },
    }),
  addPreMember: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.addPreMember(clubId),
      mutationFn: (data: AddPreMemberRequest) => postAddPreMember(clubId, data),
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) }),
          queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.preMembers(clubId) }),
        ]);
      },
    }),
  deletePreMember: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.deletePreMember(clubId),
      mutationFn: (preMemberId: number) => deletePreMember(clubId, preMemberId),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.preMembers(clubId) });
      },
    }),
};
