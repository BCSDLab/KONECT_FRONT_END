import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getClubFee, getClubQuestions } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';
import useApplyToClub from './useApplyToClub';

const useClubApply = (clubId: number) => {
  const { data: clubQuestions } = useSuspenseQuery({
    queryKey: clubQueryKeys.questions(clubId),
    queryFn: () => getClubQuestions(clubId),
  });

  const { data: clubFee, isLoading: isFeeLoading } = useQuery({
    queryKey: clubQueryKeys.fee(clubId),
    queryFn: () => getClubFee(clubId),
  });

  const isFeeRequired = clubFee?.amount != null && clubFee.amount > 0;

  const { applyToClub } = useApplyToClub(clubId);

  const applyDirectly = () => applyToClub({ answers: [] });

  const hasQuestions = clubQuestions && clubQuestions.questions.length > 0;

  return { clubQuestions, applyToClub, applyDirectly, hasQuestions, isFeeRequired, isFeeLoading };
};

export default useClubApply;
