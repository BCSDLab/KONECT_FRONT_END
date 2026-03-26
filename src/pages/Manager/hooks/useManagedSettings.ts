import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getClubSettings, patchClubSettings } from '@/apis/club';
import type { ClubSettingsPatchRequest } from '@/apis/club/entity';

const settingsQueryKeys = {
  all: ['manager'],
  clubSettings: (clubId: number) => [...settingsQueryKeys.all, 'clubSettings', clubId],
};

export const useGetClubSettings = (clubId: number) => {
  return useQuery({
    queryKey: settingsQueryKeys.clubSettings(clubId),
    queryFn: () => getClubSettings(clubId),
    retry: false,
  });
};

export const usePatchClubSettings = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClubSettingsPatchRequest) => patchClubSettings(clubId, data),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(settingsQueryKeys.clubSettings(clubId), updatedSettings);
    },
  });
};
