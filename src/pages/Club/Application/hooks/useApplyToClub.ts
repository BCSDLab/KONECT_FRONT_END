import { useNavigate } from 'react-router-dom';
import { useApplyClubMutation } from '@/apis/club/hooks';

const useApplyToClub = (clubId: number) => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useApplyClubMutation(clubId);

  const applyToClub = async (...args: Parameters<typeof mutateAsync>) => {
    await mutateAsync(...args);
    navigate(`/clubs/${clubId}/complete`);
  };

  return { applyToClub, isPending };
};

export default useApplyToClub;
