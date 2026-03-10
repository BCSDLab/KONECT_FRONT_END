import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applyClub } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';
import { clubQueryKeys } from '@/apis/club/queries';

const useApplyToClub = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: applyToClub, isPending } = useMutation({
    mutationKey: ['applyToClub', clubId],
    mutationFn: (body: ClubApplyRequest) => applyClub(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      navigate(`/clubs/${clubId}/complete`);
    },
  });

  return { applyToClub, isPending };
};

export default useApplyToClub;
