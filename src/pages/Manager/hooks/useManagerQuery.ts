import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getClubQuestions,
  getClubRecruitment,
  getManagedClubApplicationDetail,
  getManagedClubApplications,
  getManagedClubs,
  postClubApplicationApprove,
  postClubApplicationReject,
  postClubRecruitment,
  putClubQuestions,
  putClubRecruitment,
} from '@/apis/club';
import type { ClubQuestionsRequest, ClubRecruitmentRequest } from '@/apis/club/entity';

const managerQueryKeys = {
  all: ['manager'],
  managedClubs: () => [...managerQueryKeys.all, 'managedClubs'],
  managedClubApplications: (clubId: number) => [...managerQueryKeys.all, 'managedClubApplications', clubId],
  managedClubApplicationDetail: (clubId: number, applicationId: number) => [
    ...managerQueryKeys.all,
    'managedClubApplicationDetail',
    clubId,
    applicationId,
  ],
  managedClubRecruitment: (clubId: number) => [...managerQueryKeys.all, 'managedClubRecruitment', clubId],
  managedClubQuestions: (clubId: number) => [...managerQueryKeys.all, 'managedClubQuestions', clubId],
};

export const useManagerQuery = () => {
  const { data: managedClubList } = useSuspenseQuery({
    queryKey: managerQueryKeys.managedClubs(),
    queryFn: getManagedClubs,
  });

  return { managedClubList };
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

export const useManagedClubRecruitment = (clubId: number, hasExisting: boolean) => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: managerQueryKeys.managedClubRecruitment(clubId),
    mutationFn: (recruitmentData: ClubRecruitmentRequest) =>
      hasExisting ? putClubRecruitment(clubId, recruitmentData) : postClubRecruitment(clubId, recruitmentData),
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
