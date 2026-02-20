import { useMutation, useQuery, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { putClubRecruitment, getClubRecruitment, getClubQuestions, putClubQuestions } from '@/apis/club';
import type { ClubRecruitmentRequest, ClubQuestionsRequest } from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';

const recruitmentQueryKeys = {
  all: ['manager'],
  managedClubRecruitment: (clubId: number) => [...recruitmentQueryKeys.all, 'managedClubRecruitment', clubId],
  managedClubQuestions: (clubId: number) => [...recruitmentQueryKeys.all, 'managedClubQuestions', clubId],
};

export const useGetManagedRecruitments = (clubId: number) => {
  return useQuery({
    queryKey: recruitmentQueryKeys.managedClubRecruitment(clubId),
    queryFn: () => getClubRecruitment(clubId),
    retry: false,
  });
};

export const useCreateRecruitment = (clubId: number) => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: recruitmentQueryKeys.managedClubRecruitment(clubId),
    mutationFn: (recruitmentData: ClubRecruitmentRequest) => putClubRecruitment(clubId, recruitmentData),
    onSuccess: () => {
      showToast('모집 공고가 생성되었습니다', 'success');
      navigate(-1);
    },
  });
};

export const useUpdateRecruitment = (clubId: number) => {
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: recruitmentQueryKeys.managedClubRecruitment(clubId),
    mutationFn: (recruitmentData: ClubRecruitmentRequest) => putClubRecruitment(clubId, recruitmentData),
    onSuccess: () => {
      showToast('모집 공고가 수정되었습니다', 'success');
      navigate(-1);
    },
  });
};

export const useManagedClubQuestions = (clubId: number) => {
  const { data: managedClubQuestions } = useSuspenseQuery({
    queryKey: recruitmentQueryKeys.managedClubQuestions(clubId),
    queryFn: () => getClubQuestions(clubId),
  });

  return { managedClubQuestions };
};

export const useManagedClubQuestionsMutation = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationKey: recruitmentQueryKeys.managedClubQuestions(clubId),
    mutationFn: (questionsData: ClubQuestionsRequest) => putClubQuestions(clubId, questionsData),
    onSuccess: () => {
      showToast('질문이 수정되었습니다', 'success');
      queryClient.invalidateQueries({ queryKey: recruitmentQueryKeys.managedClubQuestions(clubId) });
      navigate(-1);
    },
  });
};
