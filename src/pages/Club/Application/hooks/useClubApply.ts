import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubQuestions, getClubRecruitment } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';
import useApplyToClub from './useApplyToClub';

const useClubApply = (clubId: number) => {
  const { data: clubQuestions } = useSuspenseQuery({
    queryKey: clubQueryKeys.questions(clubId),
    queryFn: () => getClubQuestions(clubId),
  });

  const { data: recruitment } = useSuspenseQuery({
    queryKey: clubQueryKeys.recruitment(clubId),
    queryFn: () => getClubRecruitment(clubId),
  });

  const isFeeRequired = recruitment.isFeeRequired;

  const { applyToClub } = useApplyToClub(clubId);

  const applyDirectly = () => applyToClub({ answers: [] });

  const hasQuestions = clubQuestions && clubQuestions.questions.length > 0;

  return { clubQuestions, applyToClub, applyDirectly, hasQuestions, isFeeRequired };
};

export default useClubApply;
