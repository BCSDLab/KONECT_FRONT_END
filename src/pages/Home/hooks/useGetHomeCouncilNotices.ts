import { useSuspenseQuery } from '@tanstack/react-query';
import { getCouncilNotice } from '@/apis/council';
import { councilQueryKeys } from '@/pages/Council/CouncilDetail/hooks/useGetCouncilInfo';

interface UseGetHomeCouncilNoticesParams {
  limit?: number;
}

export const useGetHomeCouncilNotices = ({ limit = 3 }: UseGetHomeCouncilNoticesParams = {}) => {
  return useSuspenseQuery({
    queryKey: councilQueryKeys.noticesPreview(limit),
    queryFn: () => getCouncilNotice({ page: 1, limit }),
  });
};
