import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getManagedClubApplicationDetail,
  getManagedClubApplications,
  getManagedClubMemberApplicationByUser,
  postClubApplicationApprove,
  postClubApplicationReject,
} from '@/apis/club';
import { useToastContext } from '@/contexts/useToastContext';
import { isApiError } from '@/interface/error';

const applicationQueryKeys = {
  all: ['manager'],
  managedClubApplications: (clubId: number, page?: number, limit?: number) => [
    ...applicationQueryKeys.all,
    'managedClubApplications',
    clubId,
    page,
    limit,
  ],
  managedClubApplicationDetail: (clubId: number, applicationId: number) => [
    ...applicationQueryKeys.all,
    'managedClubApplicationDetail',
    clubId,
    applicationId,
  ],
  managedClubMemberApplicationDetailByUser: (clubId: number, userId: number) => [
    ...applicationQueryKeys.all,
    'managedClubMemberApplicationDetailByUser',
    clubId,
    userId,
  ],
};

interface ApplicationMutationOptions {
  navigateBack?: boolean;
}

export const useGetManagedApplications = (clubId: number, page: number, limit: number) => {
  const { data: managedClubApplicationList } = useSuspenseQuery({
    queryKey: applicationQueryKeys.managedClubApplications(clubId, page, limit),
    queryFn: async () => {
      try {
        return await getManagedClubApplications(clubId, { page, limit, sortBy: 'APPLIED_AT', sortDirection: 'ASC' });
      } catch (error) {
        if (isApiError(error) && error.apiError?.code === 'NOT_FOUND_CLUB_RECRUITMENT') {
          return null;
        }
        throw error;
      }
    },
  });

  return { managedClubApplicationList, hasNoRecruitment: managedClubApplicationList === null };
};

export const useGetManagedApplicationDetail = (clubId: number, applicationId: number) => {
  const { data: managedClubApplicationDetail } = useSuspenseQuery({
    queryKey: applicationQueryKeys.managedClubApplicationDetail(clubId, applicationId),
    queryFn: () => getManagedClubApplicationDetail(clubId, applicationId),
  });

  return { managedClubApplicationDetail };
};

export const useGetManagedMemberApplicationDetailByUser = (clubId: number, userId: number) => {
  const { data: managedClubMemberApplicationDetail } = useSuspenseQuery({
    queryKey: applicationQueryKeys.managedClubMemberApplicationDetailByUser(clubId, userId),
    queryFn: async () => {
      try {
        return await getManagedClubMemberApplicationByUser(clubId, userId);
      } catch (error) {
        if (isApiError(error) && error.apiError?.code === 'NOT_FOUND_CLUB_APPLY') {
          return null;
        }
        throw error;
      }
    },
  });

  return {
    managedClubMemberApplicationDetail,
    hasNoMemberApplication: managedClubMemberApplicationDetail === null,
  };
};

export const useApproveApplication = (clubId: number, options: ApplicationMutationOptions = {}) => {
  const { navigateBack = false } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (applicationId: number) => postClubApplicationApprove(clubId, applicationId),
    onSuccess: () => {
      showToast('지원이 승인되었습니다');
      queryClient.invalidateQueries({ queryKey: [...applicationQueryKeys.all, 'managedClubApplications', clubId] });
      if (navigateBack) navigate(-1);
    },
  });
};

export const useRejectApplication = (clubId: number, options: ApplicationMutationOptions = {}) => {
  const { navigateBack = false } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (applicationId: number) => postClubApplicationReject(clubId, applicationId),
    onSuccess: () => {
      showToast('지원이 거절되었습니다');
      queryClient.invalidateQueries({ queryKey: [...applicationQueryKeys.all, 'managedClubApplications', clubId] });
      if (navigateBack) navigate(-1);
    },
  });
};
