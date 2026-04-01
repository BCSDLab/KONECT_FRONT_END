import { mutationOptions } from '@tanstack/react-query';
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
} from '@/apis/club';
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
} from '@/apis/club/entity';

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
  updateInfo: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateInfo(clubId),
      mutationFn: (data: ClubInfoRequest) => putClubInfo(clubId, data),
    }),
  updateFee: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateFee(clubId),
      mutationFn: (data: ClubFeeRequest) => putClubFee(clubId, data),
    }),
  upsertRecruitment: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.upsertRecruitment(clubId),
      mutationFn: (data: ClubRecruitmentRequest) => putClubRecruitment(clubId, data),
    }),
  updateQuestions: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.updateQuestions(clubId),
      mutationFn: (data: ClubQuestionsRequest) => putClubQuestions(clubId, data),
    }),
  patchSettings: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.patchSettings(clubId),
      mutationFn: (data: ClubSettingsPatchRequest) => patchClubSettings(clubId, data),
    }),
  approveApplication: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.approveApplication(clubId),
      mutationFn: (applicationId: number) => postClubApplicationApprove(clubId, applicationId),
    }),
  rejectApplication: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.rejectApplication(clubId),
      mutationFn: (applicationId: number) => postClubApplicationReject(clubId, applicationId),
    }),
  transferPresident: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.transferPresident(clubId),
      mutationFn: (data: TransferPresidentRequest) => postTransferPresident(clubId, data),
    }),
  changeVicePresident: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.changeVicePresident(clubId),
      mutationFn: (data: ChangeVicePresidentRequest) => patchVicePresident(clubId, data),
    }),
  changeMemberPosition: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.changeMemberPosition(clubId),
      mutationFn: ({ userId, data }: { data: ChangeMemberPositionRequest; userId: number }) =>
        patchMemberPosition(clubId, userId, data),
    }),
  removeMember: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.removeMember(clubId),
      mutationFn: (userId: number) => deleteMember(clubId, userId),
    }),
  addPreMember: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.addPreMember(clubId),
      mutationFn: (data: AddPreMemberRequest) => postAddPreMember(clubId, data),
    }),
  deletePreMember: (clubId: number) =>
    mutationOptions({
      mutationKey: managedClubMutationKeys.deletePreMember(clubId),
      mutationFn: (preMemberId: number) => deletePreMember(clubId, preMemberId),
    }),
};
