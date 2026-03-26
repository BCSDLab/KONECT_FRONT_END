import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { StudyRankingParams } from './entity';
import { getMyStudyTimeRanking, getStudyTimeRanking, getStudyTimeSummary } from '.';

interface StudyTimeRankingKeyParams {
  limit: number;
  sort: StudyRankingParams['sort'];
  type: StudyRankingParams['type'];
}

interface MyStudyTimeRankingKeyParams {
  sort: StudyRankingParams['sort'];
  type: StudyRankingParams['type'];
}

export const studyTimeQueryKeys = {
  all: ['studyTime'] as const,
  summary: () => [...studyTimeQueryKeys.all, 'summary'] as const,
  ranking: (params: StudyTimeRankingKeyParams) =>
    [...studyTimeQueryKeys.all, 'ranking', params.limit, params.sort, params.type] as const,
  myRanking: (params: MyStudyTimeRankingKeyParams) =>
    [...studyTimeQueryKeys.all, 'myRanking', params.sort, params.type] as const,
};

export const studyTimeQueries = {
  summary: () =>
    queryOptions({
      queryKey: studyTimeQueryKeys.summary(),
      queryFn: getStudyTimeSummary,
    }),
  ranking: ({ limit, sort, type }: StudyTimeRankingKeyParams) =>
    infiniteQueryOptions({
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
    }),
  myRanking: ({ sort, type }: MyStudyTimeRankingKeyParams) =>
    queryOptions({
      queryKey: studyTimeQueryKeys.myRanking({ sort, type }),
      queryFn: () => getMyStudyTimeRanking({ sort }),
      select: (data) => {
        if (type === 'CLUB') return data.clubRankings;
        if (type === 'STUDENT_NUMBER') return [data.studentNumberRanking];
        return [data.personalRanking];
      },
    }),
};
