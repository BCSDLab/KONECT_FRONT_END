import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import { studyTimeQueries } from '@/apis/studyTime/queries';

const STUDY_TIME_RANKING_REFETCH_INTERVAL = 10_000;

interface UseStudyTimeRankingParams {
  limit?: number;
  sort?: StudyRankingParams['sort'];
  type?: StudyRankingParams['type'];
}

export const useStudyTimeRanking = ({
  limit = 20,
  sort = 'MONTHLY',
  type = 'PERSONAL',
}: UseStudyTimeRankingParams = {}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    ...studyTimeQueries.ranking({ limit, sort, type }),
    refetchInterval: STUDY_TIME_RANKING_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
  });

  const { data: myRankingData } = useSuspenseQuery({
    ...studyTimeQueries.myRanking({ sort, type }),
    refetchInterval: STUDY_TIME_RANKING_REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
  });

  const rankings = data?.pages.flatMap((page) => page.rankings) ?? [];
  const myRankings = myRankingData ?? [];

  return {
    rankings,
    myRankings,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
