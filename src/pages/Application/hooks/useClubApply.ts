import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applyClub, getClubQuestions } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';

const useClubApply = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clubQuestions } = useSuspenseQuery({
    queryKey: ['clubQuestions', clubId],
    queryFn: () => getClubQuestions(clubId),
  });

  const { mutateAsync: applyToClub } = useMutation({
    mutationKey: ['applyToClub', clubId],
    mutationFn: (answers: ClubApplyRequest) => applyClub(clubId, answers),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubDetail', clubId] });
      if (data.amount !== null) {
        navigate(`/clubs/${clubId}/fee`);
      } else {
        navigate(`/clubs/${clubId}/finish`);
      }
    },
  });

  const applyDirectly = () => applyToClub({ answers: [] });

  const hasQuestions = clubQuestions && clubQuestions.questions.length > 0;

  return { clubQuestions, applyToClub, applyDirectly, hasQuestions };
};

export default useClubApply;
