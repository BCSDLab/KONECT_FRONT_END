import { useMutation, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getClubMembers,
  postTransferPresident,
  patchVicePresident,
  patchMemberPosition,
  deleteMember,
  postAddPreMember,
  deletePreMember,
  getPreMembers,
} from '@/apis/club';
import type {
  AddPreMemberRequest,
  ChangeMemberPositionRequest,
  ChangeVicePresidentRequest,
  TransferPresidentRequest,
} from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';

const memberQueryKeys = {
  all: ['manager'],
  managedMembers: (clubId: number) => [...memberQueryKeys.all, 'managedMembers', clubId],
  managedClub: (clubId: number) => [...memberQueryKeys.all, 'managedClub', clubId],
  preMembersList: (clubId: number) => [...memberQueryKeys.all, 'preMembersList', clubId],
};

export const useManagedMembers = (clubId: number) => {
  const { data: managedMemberList } = useSuspenseQuery({
    queryKey: memberQueryKeys.managedMembers(clubId),
    queryFn: () => getClubMembers(clubId),
  });

  return { managedMemberList };
};

export const useTransferPresident = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (data: TransferPresidentRequest) => postTransferPresident(clubId, data),
    onSuccess: () => {
      showToast('회장이 위임되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedMembers(clubId) });
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedClub(clubId) });
      navigate(-1);
    },
  });
};

export const useChangeVicePresident = (clubId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (data: ChangeVicePresidentRequest) => patchVicePresident(clubId, data),
    onSuccess: () => {
      showToast('부회장이 변경되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useChangeMemberPosition = (clubId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: ChangeMemberPositionRequest }) =>
      patchMemberPosition(clubId, userId, data),
    onSuccess: () => {
      showToast('직책이 변경되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useRemoveMember = (clubId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (userId: number) => deleteMember(clubId, userId),
    onSuccess: () => {
      showToast('부원이 추방되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedMembers(clubId) });
    },
  });
};

export const useAddPreMember = (clubId: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (data: AddPreMemberRequest) => postAddPreMember(clubId, data),
    onSuccess: () => {
      showToast('부원이 추가되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.managedMembers(clubId) });
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.preMembersList(clubId) });
      navigate(-1);
    },
  });
};

export const useGetPreMemberList = (clubId: number) => {
  const { data: preMembersList } = useSuspenseQuery({
    queryKey: memberQueryKeys.preMembersList(clubId),
    queryFn: () => getPreMembers(clubId),
  });

  return { preMembersList };
};

export const useDeletePreMember = (clubId: number) => {
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();

  return useMutation({
    mutationFn: (preMemberId: number) => deletePreMember(clubId, preMemberId),
    onSuccess: () => {
      showToast('사전 등록 회원이 삭제되었습니다');
      queryClient.invalidateQueries({ queryKey: memberQueryKeys.preMembersList(clubId) });
    },
  });
};
