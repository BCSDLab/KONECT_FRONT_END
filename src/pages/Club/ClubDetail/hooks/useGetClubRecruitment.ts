import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubRecruitment } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

const useGetClubRecruitment = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.recruitment(clubId),
    queryFn: () => getClubRecruitment(clubId),
  });
};

export default useGetClubRecruitment;
