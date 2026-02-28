import { useSuspenseQuery } from '@tanstack/react-query';
import { getManagedClubMemberApplications } from '@/apis/club';

const memberApplicationQueryKeys = {
  all: ['manager'],
  managedClubMemberApplications: (clubId: number, page?: number, limit?: number) => [
    ...memberApplicationQueryKeys.all,
    'managedClubMemberApplications',
    clubId,
    page,
    limit,
  ],
};

export const useGetManagedMemberApplications = (clubId: number, page: number, limit: number) => {
  const { data: managedClubMemberApplicationList } = useSuspenseQuery({
    queryKey: memberApplicationQueryKeys.managedClubMemberApplications(clubId, page, limit),
    queryFn: () =>
      getManagedClubMemberApplications(clubId, { page, limit, sortBy: 'APPLIED_AT', sortDirection: 'ASC' }),
  });

  return { managedClubMemberApplicationList };
};
