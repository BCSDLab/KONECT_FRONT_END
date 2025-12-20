import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applyClub, getClubQuestions } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';

export const useClubApply = (clubId: number) => {
  const navigate = useNavigate();

  const { data: clubQuestions } = useSuspenseQuery({
    queryKey: ['clubQuestions', clubId],
    queryFn: () => getClubQuestions(clubId),
  });

  const { mutateAsync: applyToClub } = useMutation({
    mutationKey: ['applyToClub', clubId],
    mutationFn: (answers: ClubApplyRequest) => applyClub(clubId, answers),
    onSuccess: () => {
      navigate(`/clubs/${clubId}/fee`);
    },
  });

  return { clubQuestions, applyToClub };
};

export default useClubApply;
