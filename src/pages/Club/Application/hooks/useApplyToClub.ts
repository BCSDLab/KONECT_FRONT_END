import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applyClub } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

const useApplyToClub = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: applyToClub } = useMutation({
    mutationKey: ['applyToClub', clubId],
    mutationFn: (body: ClubApplyRequest) => applyClub(clubId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      navigate(`/clubs/${clubId}/complete`);
    },
  });

  return { applyToClub };
};

export default useApplyToClub;
