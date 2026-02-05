import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getBanks,
  getClubFee,
  getClubQuestions,
  getClubRecruitment,
  getManagedClub,
  getManagedClubApplicationDetail,
  getManagedClubApplications,
  getManagedClubs,
  postClubApplicationApprove,
  postClubApplicationReject,
  putClubFee,
  putClubInfo,
  putClubQuestions,
  putClubRecruitment,
  getClubMembers,
  postTransferPresident,
  postAddPreMember,
  patchVicePresident,
  patchMemberPosition,
  deleteMember,
} from '@/apis/club';
import type {
  AddPreMemberRequest,
  ChangeMemberPositionRequest,
  ChangeVicePresidentRequest,
  ClubFeeRequest,
  ClubInfoRequest,
  ClubQuestionsRequest,
  ClubRecruitmentRequest,
  TransferPresidentRequest,
} from '@/apis/club/entity';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

const managerQueryKeys = {
  all: ['manager'],
  managedClubs: () => [...managerQueryKeys.all, 'managedClubs'],
  managedClub: (clubId: number) => [...managerQueryKeys.all, 'managedClub', clubId],
  managedClubApplications: (clubId: number) => [...managerQueryKeys.all, 'managedClubApplications', clubId],
  managedClubApplicationDetail: (clubId: number, applicationId: number) => [
    ...managerQueryKeys.all,
    'managedClubApplicationDetail',
    clubId,
    applicationId,
  ],
  managedClubRecruitment: (clubId: number) => [...managerQueryKeys.all, 'managedClubRecruitment', clubId],
  managedClubQuestions: (clubId: number) => [...managerQueryKeys.all, 'managedClubQuestions', clubId],
  managedClubInfo: (clubId: number) => [...managerQueryKeys.all, 'managedClubInfo', clubId],
  banks: () => [...managerQueryKeys.all, 'banks'],
  managedClubFee: (clubId: number) => [...managerQueryKeys.all, 'managedClubFee', clubId],
  managedMembers: (clubId: number) => [...managerQueryKeys.all, 'managedMembers', clubId],
};

export const useManagerQuery = () => {
  const { data: managedClubList } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubs(),
    queryFn: getManagedClubs,
  });

  return { managedClubList };
};

export const useManagedClub = (clubId: number) => {
  const { data: managedClub } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClub(clubId),
    queryFn: () => getManagedClub(clubId),
  });

  return { managedClub };
};

export const useManagedClubApplications = (clubId: number) => {
  const { data: managedClubApplicationList } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubApplications(clubId),
    queryFn: () => getManagedClubApplications(clubId),
  });

  return { managedClubApplicationList };
};

export const useManagedClubApplicationDetail = (clubId: number, applicationId: number) => {
  const { data: managedClubApplicationDetail } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubApplicationDetail(clubId, applicationId),
    queryFn: () => getManagedClubApplicationDetail(clubId, applicationId),
  });

  return { managedClubApplicationDetail };
};

export const useManagedClubRecruitmentQuery = (clubId: number) => {
  return useQuery({
    queryKey: managerQueryKeys.managedClubRecruitment(clubId),
    queryFn: () => getClubRecruitment(clubId),
    retry: false,
  });
};

export const useManagedClubRecruitment = (clubId: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: managerQueryKeys.managedClubRecruitment(clubId),
    mutationFn: (recruitmentData: ClubRecruitmentRequest) => putClubRecruitment(clubId, recruitmentData),
    onSuccess: () => navigate(-1),
  });
};

export const useManagedClubQuestions = (clubId: number) => {
  const { data: managedClubQuestions } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubQuestions(clubId),
    queryFn: () => getClubQuestions(clubId),
  });

  return { managedClubQuestions };
};

export const useManagedClubQuestionsMutation = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: managerQueryKeys.managedClubQuestions(clubId),
    mutationFn: (questionsData: ClubQuestionsRequest) => putClubQuestions(clubId, questionsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedClubQuestions(clubId) });
      navigate(-1);
    },
  });
};

interface ApplicationMutationOptions {
  navigateBack?: boolean;
}

export const useApplicationApprove = (clubId: number, options: ApplicationMutationOptions = {}) => {
  const { navigateBack = false } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) => postClubApplicationApprove(clubId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedClubApplications(clubId) });
      if (navigateBack) navigate(-1);
    },
  });
};

export const useApplicationReject = (clubId: number, options: ApplicationMutationOptions = {}) => {
  const { navigateBack = false } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) => postClubApplicationReject(clubId, applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedClubApplications(clubId) });
      if (navigateBack) navigate(-1);
    },
  });
};

export const useManagedClubInfo = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: managerQueryKeys.managedClubInfo(clubId),
    mutationFn: (data: ClubInfoRequest) => putClubInfo(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      navigate(-1);
    },
  });
};

export const useGetBanks = () => {
  const { data: banks } = useSuspenseQuery({
    queryKey: managerQueryKeys.banks(),
    queryFn: getBanks,
  });

  return { banks };
};

export const useManagedClubFee = (clubId: number) => {
  const { data: managedClubFee } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubFee(clubId),
    queryFn: () => getClubFee(clubId),
  });

  return { managedClubFee };
};

export const useManagedClubFeeMutation = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: managerQueryKeys.managedClubFee(clubId),
    mutationFn: (data: ClubFeeRequest) => putClubFee(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedClubFee(clubId) });
      navigate(-1);
    },
  });
};

//========================== Member Management Hooks =========================//

export const useManagedMembers = (clubId: number) => {
  const { data: managedMemberList } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedMembers(clubId),
    queryFn: () => getClubMembers(clubId),
  });

  return { managedMemberList };
};

export const useTransferPresident = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferPresidentRequest) => postTransferPresident(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedMembers(clubId) });
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedClub(clubId) });
      navigate(-1);
    },
  });
};

export const useChangeVicePresident = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeVicePresidentRequest) => patchVicePresident(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useChangeMemberPosition = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: ChangeMemberPositionRequest }) =>
      patchMemberPosition(clubId, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useRemoveMember = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => deleteMember(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useAddPreMember = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddPreMemberRequest) => postAddPreMember(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerQueryKeys.managedMembers(clubId) });
    },
  });
};
