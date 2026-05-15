import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getBanks,
  getClubFee,
  getClubMembers,
  getClubQuestions,
  getClubRecruitment,
  getClubSettings,
  getManagedClub,
  getManagedClubApplicationDetail,
  getManagedClubApplications,
  getManagedClubMemberApplicationByUser,
  getManagedClubMemberApplications,
  getManagedClubs,
  getPreMembers,
  postClubSheetImportPreview,
} from '@/apis/club';
import { isApiError } from '@/utils/ts/error/apiError';

interface ManagedClubApplicationsParams {
  clubId: number;
  limit: number;
}

interface ManagedClubMemberApplicationsParams {
  clubId: number;
  limit: number;
  page: number;
}

export const managedClubQueryKeys = {
  all: ['clubs', 'managed'] as const,
  clubs: () => [...managedClubQueryKeys.all, 'clubs'] as const,
  club: (clubId: number) => [...managedClubQueryKeys.all, 'club', clubId] as const,
  applications: (clubId: number) => [...managedClubQueryKeys.all, 'applications', clubId] as const,
  applicationsInfinite: ({ clubId, limit }: ManagedClubApplicationsParams) =>
    [...managedClubQueryKeys.applications(clubId), 'infinite', limit] as const,
  applicationDetail: (clubId: number, applicationId: number) =>
    [...managedClubQueryKeys.all, 'applicationDetail', clubId, applicationId] as const,
  memberApplications: ({ clubId, page, limit }: ManagedClubMemberApplicationsParams) =>
    [...managedClubQueryKeys.all, 'memberApplications', clubId, page, limit] as const,
  memberApplicationDetail: (clubId: number, userId: number) =>
    [...managedClubQueryKeys.all, 'memberApplicationDetail', clubId, userId] as const,
  banks: () => [...managedClubQueryKeys.all, 'banks'] as const,
  fee: (clubId: number) => [...managedClubQueryKeys.all, 'fee', clubId] as const,
  recruitment: (clubId: number) => [...managedClubQueryKeys.all, 'recruitment', clubId] as const,
  questions: (clubId: number) => [...managedClubQueryKeys.all, 'questions', clubId] as const,
  settings: (clubId: number) => [...managedClubQueryKeys.all, 'settings', clubId] as const,
  members: (clubId: number) => [...managedClubQueryKeys.all, 'members', clubId] as const,
  preMembers: (clubId: number) => [...managedClubQueryKeys.all, 'preMembers', clubId] as const,
  sheetImportPreview: (clubId: number) => [...managedClubQueryKeys.all, 'sheetImportPreview', clubId] as const,
};

export const managedClubQueries = {
  clubs: () =>
    queryOptions({
      queryKey: managedClubQueryKeys.clubs(),
      queryFn: getManagedClubs,
    }),
  club: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.club(clubId),
      queryFn: () => getManagedClub(clubId),
    }),
  applications: ({ clubId, limit }: ManagedClubApplicationsParams) =>
    infiniteQueryOptions({
      queryKey: managedClubQueryKeys.applicationsInfinite({ clubId, limit }),
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
    }),
  applicationDetail: (clubId: number, applicationId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.applicationDetail(clubId, applicationId),
      queryFn: () => getManagedClubApplicationDetail(clubId, applicationId),
    }),
  memberApplications: ({ clubId, page, limit }: ManagedClubMemberApplicationsParams) =>
    queryOptions({
      queryKey: managedClubQueryKeys.memberApplications({ clubId, page, limit }),
      queryFn: () =>
        getManagedClubMemberApplications(clubId, {
          page,
          limit,
          sortBy: 'APPLIED_AT',
          sortDirection: 'ASC',
        }),
    }),
  memberApplicationDetail: (clubId: number, userId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.memberApplicationDetail(clubId, userId),
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
    }),
  banks: () =>
    queryOptions({
      queryKey: managedClubQueryKeys.banks(),
      queryFn: getBanks,
    }),
  fee: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.fee(clubId),
      queryFn: () => getClubFee(clubId),
    }),
  recruitment: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.recruitment(clubId),
      queryFn: () => getClubRecruitment(clubId),
      retry: false,
    }),
  questions: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.questions(clubId),
      queryFn: () => getClubQuestions(clubId),
    }),
  settings: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.settings(clubId),
      queryFn: () => getClubSettings(clubId),
      retry: false,
    }),
  members: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.members(clubId),
      queryFn: () => getClubMembers(clubId),
    }),
  preMembers: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.preMembers(clubId),
      queryFn: () => getPreMembers(clubId),
    }),
  sheetImportPreview: (clubId: number) =>
    queryOptions({
      queryKey: managedClubQueryKeys.sheetImportPreview(clubId),
      queryFn: () => postClubSheetImportPreview(clubId),
    }),
};
