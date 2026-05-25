import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { recentClubQueries } from '@/apis/recentClub/queries';
import { useRecentClubIds } from '@/hooks/useRecentClubIds';

const MAX_RECENT_CLUB_COUNT = 4;

export function useRecentClubs(currentClubId?: number) {
  const clubIds = useRecentClubIds();
  const displayClubIds = useMemo(() => {
    if (!currentClubId || !Number.isInteger(currentClubId) || currentClubId <= 0) return clubIds;

    return [currentClubId, ...clubIds.filter((clubId) => clubId !== currentClubId)].slice(0, MAX_RECENT_CLUB_COUNT);
  }, [clubIds, currentClubId]);

  return useQuery({
    ...recentClubQueries.list(displayClubIds),
    enabled: displayClubIds.length > 0,
  });
}
