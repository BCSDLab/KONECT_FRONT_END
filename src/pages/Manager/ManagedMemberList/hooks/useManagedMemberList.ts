import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

import type { PositionType } from '@/apis/club/entity';
import { managedClubQueries } from '@/apis/club/managedQueries';
import { useCreateChatRoomMutation } from '@/pages/Chat/hooks/useChatMutations';
import useAddMember from './useAddMember';
import useMemberAction from './useMemberAction';
import useMemberSheetImport from './useMemberSheetImport';
import usePreMemberAction from './usePreMemberAction';
import useRoleManage from './useRoleManage';

const PROTECTED_POSITIONS = new Set<PositionType>(['PRESIDENT', 'VICE_PRESIDENT']);

export default function useManagedMemberList() {
  const params = useParams();
  const clubId = Number(params.clubId);
  const navigate = useNavigate();

  const { data: managedMemberList } = useSuspenseQuery(managedClubQueries.members(clubId));
  const { data: preMembersList } = useSuspenseQuery(managedClubQueries.preMembers(clubId));
  const { mutateAsync: createChatRoom, isPending: isCreatingChatRoom } = useCreateChatRoomMutation();

  const members = managedMemberList.clubMembers;

  const roleManage = useRoleManage(clubId, members);
  const addMember = useAddMember(clubId);
  const memberAction = useMemberAction(clubId);
  const memberSheetImport = useMemberSheetImport(clubId);
  const preMemberAction = usePreMemberAction(clubId);

  const isPending =
    roleManage.isPending ||
    memberAction.isRemoving ||
    addMember.isAdding ||
    memberSheetImport.isSubmitting ||
    preMemberAction.isDeletingPreMember ||
    isCreatingChatRoom;

  const total = members.length;
  const protectedMembers = useMemo(() => members.filter((m) => PROTECTED_POSITIONS.has(m.position)), [members]);
  const generalMembers = useMemo(() => members.filter((m) => m.position === 'MEMBER'), [members]);

  const handleCreateChatRoom = async () => {
    if (!memberAction.selectedMember) return;
    const { chatRoomId } = await createChatRoom(memberAction.selectedMember.userId);
    navigate(`/chats/${chatRoomId}`);
  };

  return {
    total,
    protectedMembers,
    managerMembers: roleManage.managerMembers,
    generalMembers,
    preMembers: preMembersList.preMembers,
    isPending,
    roleManage,
    addMember,
    memberAction,
    memberSheetImport,
    preMemberAction,
    handleCreateChatRoom,
  } as const;
}
