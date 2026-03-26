import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { clubMutations } from '@/apis/club/mutations';
import { clubQueryKeys } from '@/apis/club/queries';

const useApplyToClub = (clubId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    ...clubMutations.apply(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
    },
  });

  const applyToClub = async (...args: Parameters<typeof mutateAsync>) => {
    await mutateAsync(...args);
    navigate(`/clubs/${clubId}/complete`);
  };

  return { applyToClub, isPending };
};

export default useApplyToClub;
