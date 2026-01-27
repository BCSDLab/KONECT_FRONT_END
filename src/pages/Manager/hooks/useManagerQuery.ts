import { useSuspenseQuery } from '@tanstack/react-query';
import { getManagedClubApplications, getManagedClubs } from '@/apis/club';

const managerQueryKeys = {
  all: ['manager'],
  managedClubs: () => [...managerQueryKeys.all, 'managedClubs'],
  managedClubApplications: (clubId: number) => [...managerQueryKeys.all, 'managedClubApplications', clubId],
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
