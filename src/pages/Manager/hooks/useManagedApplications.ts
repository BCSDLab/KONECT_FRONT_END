import { useMutation, useQueryClient, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
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
  managedClubApplications: (clubId: number) => [...applicationQueryKeys.all, 'managedClubApplications', clubId],
  managedClubApplicationsInfinite: (clubId: number, limit: number) => [
    ...applicationQueryKeys.managedClubApplications(clubId),
    'infinite',
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

interface UseGetManagedApplicationsParams {
  limit?: number;
}

export const useGetManagedApplications = (clubId: number, { limit = 10 }: UseGetManagedApplicationsParams = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery({
    queryKey: applicationQueryKeys.managedClubApplicationsInfinite(clubId, limit),
    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await getManagedClubApplications(clubId, {
          page: pageParam,
          limit,
          sortBy: 'APPLIED_AT',
          sortDirection: 'ASC',
        });
      } catch (error) {
        if (isApiError(error) && error.apiError?.code === 'NOT_FOUND_CLUB_RECRUITMENT') {
          return null;
        }
        throw error;
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.currentPage >= lastPage.totalPage) {
        return undefined;
      }

      return lastPage.currentPage + 1;
    },
  });

  const managedClubApplicationList = data.pages[0] ?? null;
  const applications = data.pages.flatMap((page) => page?.applications ?? []);

  return {
    managedClubApplicationList,
    applications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    hasNoRecruitment: managedClubApplicationList === null,
  };
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
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.managedClubApplications(clubId) });
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
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.managedClubApplications(clubId) });
      if (navigateBack) navigate(-1);
    },
  });
};
