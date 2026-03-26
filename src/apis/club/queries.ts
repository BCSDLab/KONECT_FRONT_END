import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { ClubRequestParams, ClubResponse, PositionType } from './entity';
import {
  getAppliedClubs,
  getClubDetail,
  getClubFee,
  getClubMembers,
  getClubQuestions,
  getClubRecruitment,
  getClubs,
  getJoinedClubs,
} from '.';

interface ClubInfiniteListParams {
  limit: number;
  query?: string;
  isRecruiting?: boolean;
}

export const clubQueryKeys = {
  all: ['clubs'] as const,
  list: (params: { limit: number; query?: string; isRecruiting: boolean }) =>
    [...clubQueryKeys.all, 'list', params.limit, params.query, params.isRecruiting] as const,
  infinite: {
    all: () => [...clubQueryKeys.all, 'infinite'] as const,
    list: (params: ClubInfiniteListParams) =>
      [...clubQueryKeys.infinite.all(), 'list', params.limit, params.query, params.isRecruiting] as const,
  },
  detail: (clubId: number) => [...clubQueryKeys.all, 'detail', clubId] as const,
  members: (clubId: number, position?: PositionType) =>
    position
      ? ([...clubQueryKeys.all, 'members', clubId, position] as const)
      : ([...clubQueryKeys.all, 'members', clubId] as const),
  membersDisabled: () => [...clubQueryKeys.all, 'members', 'disabled'] as const,
  recruitment: (clubId: number) => [...clubQueryKeys.all, 'recruitment', clubId] as const,
  fee: (clubId: number) => [...clubQueryKeys.all, 'fee', clubId] as const,
  questions: (clubId: number) => [...clubQueryKeys.all, 'questions', clubId] as const,
  joined: () => [...clubQueryKeys.all, 'joined'] as const,
  applied: () => [...clubQueryKeys.all, 'applied'] as const,
};

const buildClubListRequest = (
  { limit, query, isRecruiting = false }: ClubInfiniteListParams,
  page: number
): ClubRequestParams => ({
  page,
  limit,
  ...(query ? { query } : {}),
  isRecruiting,
});

export const clubQueries = {
  detail: (clubId: number) =>
    queryOptions({
      queryKey: clubQueryKeys.detail(clubId),
      queryFn: () => getClubDetail(clubId),
    }),
  members: (clubId?: number, position?: PositionType) =>
    queryOptions({
      queryKey: clubId ? clubQueryKeys.members(clubId, position) : clubQueryKeys.membersDisabled(),
      queryFn: () => getClubMembers(clubId!, position),
      enabled: Boolean(clubId),
    }),
  recruitment: (clubId: number) =>
    queryOptions({
      queryKey: clubQueryKeys.recruitment(clubId),
      queryFn: () => getClubRecruitment(clubId),
    }),
  fee: (clubId: number) =>
    queryOptions({
      queryKey: clubQueryKeys.fee(clubId),
      queryFn: () => getClubFee(clubId),
    }),
  questions: (clubId: number) =>
    queryOptions({
      queryKey: clubQueryKeys.questions(clubId),
      queryFn: () => getClubQuestions(clubId),
    }),
  joined: () =>
    queryOptions({
      queryKey: clubQueryKeys.joined(),
      queryFn: getJoinedClubs,
    }),
  applied: () =>
    queryOptions({
      queryKey: clubQueryKeys.applied(),
      queryFn: getAppliedClubs,
    }),
  infiniteList: (params: ClubInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: clubQueryKeys.infinite.list(params),
      queryFn: ({ pageParam = 1 }) => getClubs(buildClubListRequest(params, pageParam)),
      initialPageParam: 1,
      getNextPageParam: (lastPage: ClubResponse) => {
        if (lastPage.currentPage < lastPage.totalPage) {
          return lastPage.currentPage + 1;
        }

        return undefined;
      },
    }),
};
