import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applyClub, getClubFee, getClubQuestions } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

const useClubApply = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clubQuestions } = useSuspenseQuery({
    queryKey: clubQueryKeys.questions(clubId),
    queryFn: () => getClubQuestions(clubId),
  });

  const { data: clubFee } = useQuery({
    queryKey: clubQueryKeys.fee(clubId),
    queryFn: () => getClubFee(clubId),
  });

  const isFeeRequired = clubFee?.amount != null && clubFee.amount > 0;

  const { mutateAsync: applyToClub } = useMutation({
    mutationKey: ['applyToClub', clubId],
    mutationFn: (body: ClubApplyRequest) => applyClub(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      navigate(`/clubs/${clubId}/complete`);
    },
  });

  const applyDirectly = () => applyToClub({ answers: [] });

  const hasQuestions = clubQuestions && clubQuestions.questions.length > 0;

  return { clubQuestions, applyToClub, applyDirectly, hasQuestions, isFeeRequired };
};

export default useClubApply;
