import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { managedClubQueries } from '@/apis/club/managedQueries';

interface UseGetManagedApplicationsParams {
  limit?: number;
}

export const useGetManagedApplications = (clubId: number, { limit = 10 }: UseGetManagedApplicationsParams = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    managedClubQueries.applications({ clubId, limit })
  );

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
