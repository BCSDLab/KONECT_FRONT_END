import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getMyStudyTimeRanking, getStudyTimeRanking } from '@/apis/studyTime';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import { studyTimeQueryKeys } from './useStudyTime';

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
    queryKey: studyTimeQueryKeys.ranking({ limit, sort, type }),
    queryFn: ({ pageParam }) =>
      getStudyTimeRanking({
        page: pageParam,
        limit,
        sort,
        type,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPage ? lastPage.currentPage + 1 : undefined;
    },
  });

  const { data: myRankingData } = useSuspenseQuery({
    queryKey: studyTimeQueryKeys.myRanking({ sort, type }),
    queryFn: () => getMyStudyTimeRanking({ sort }),
    select: (data) => {
      if (type === 'CLUB') return data.clubRankings;
      if (type === 'STUDENT_NUMBER') return [data.studentNumberRanking];
      return [data.personalRanking];
    },
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
