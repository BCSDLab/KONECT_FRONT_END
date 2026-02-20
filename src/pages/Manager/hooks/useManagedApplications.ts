import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getManagedClubApplicationDetail,
  getManagedClubApplications,
  postClubApplicationApprove,
  postClubApplicationReject,
} from '@/apis/club';
import { useToastContext } from '@/contexts/useToastContext';

const applicationQueryKeys = {
  all: ['manager'],
  managedClubApplications: (clubId: number) => [...applicationQueryKeys.all, 'managedClubApplications', clubId],
  managedClubApplicationDetail: (clubId: number, applicationId: number) => [
    ...applicationQueryKeys.all,
    'managedClubApplicationDetail',
    clubId,
    applicationId,
  ],
};

interface ApplicationMutationOptions {
  navigateBack?: boolean;
}

export const useGetManagedApplications = (clubId: number) => {
  const { data: managedClubApplicationList } = useSuspenseQuery({
    queryKey: applicationQueryKeys.managedClubApplications(clubId),
    queryFn: () => getManagedClubApplications(clubId),
  });

  return { managedClubApplicationList };
};

export const useGetManagedApplicationDetail = (clubId: number, applicationId: number) => {
  const { data: managedClubApplicationDetail } = useSuspenseQuery({
    queryKey: applicationQueryKeys.managedClubApplicationDetail(clubId, applicationId),
    queryFn: () => getManagedClubApplicationDetail(clubId, applicationId),
  });

  return { managedClubApplicationDetail };
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
