export const clubQueryKeys = {
  all: ['clubs'] as const,
  list: (params: { limit: number; query?: string; isRecruiting: boolean }) => [
    ...clubQueryKeys.all,
    'list',
    params.limit,
    params.query,
    params.isRecruiting,
  ],
  infinite: {
    all: () => [...clubQueryKeys.all, 'infinite'] as const,
    list: (params: { limit: number; query?: string; isRecruiting?: boolean }) => [
      ...clubQueryKeys.infinite.all(),
      'list',
      params.limit,
      params.query,
      params.isRecruiting,
    ],
  },
  detail: (clubId: number) => [...clubQueryKeys.all, 'detail', clubId],
  members: (clubId: number) => [...clubQueryKeys.all, 'members', clubId],
  recruitment: (clubId: number) => [...clubQueryKeys.all, 'recruitment', clubId],
  fee: (clubId: number) => [...clubQueryKeys.all, 'fee', clubId],
  questions: (clubId: number) => [...clubQueryKeys.all, 'questions', clubId],
  joined: () => [...clubQueryKeys.all, 'joined'],
  applied: () => [...clubQueryKeys.all, 'applied'],
};
