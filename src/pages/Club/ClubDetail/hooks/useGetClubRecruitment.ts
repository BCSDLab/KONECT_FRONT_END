import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubRecruitment } from '@/apis/club';

const useGetClubRecruitment = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: ['clubRecruitment', clubId],
    queryFn: () => getClubRecruitment(clubId),
  });
};

export default useGetClubRecruitment;
