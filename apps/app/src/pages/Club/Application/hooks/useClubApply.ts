import { useSuspenseQuery } from '@tanstack/react-query';
import { clubQueries } from '@/apis/club/queries';
import useApplyToClub from './useApplyToClub';

const useClubApply = (clubId: number) => {
  const { data: clubQuestions } = useSuspenseQuery(clubQueries.questions(clubId));

  const { data: recruitment } = useSuspenseQuery(clubQueries.recruitment(clubId));

  const { data: clubFee } = useSuspenseQuery(clubQueries.fee(clubId));

  const hasFeeData = clubFee.amount !== null && clubFee.accountNumber !== null;
  const isFeeRequired = recruitment.isFeeRequired && hasFeeData;

  const { applyToClub, isPending } = useApplyToClub(clubId);

  const applyDirectly = () => applyToClub({ answers: [] });

  const hasQuestions = clubQuestions && clubQuestions.questions.length > 0;

  return { clubQuestions, applyToClub, applyDirectly, hasQuestions, isFeeRequired, isPending };
};

export default useClubApply;
