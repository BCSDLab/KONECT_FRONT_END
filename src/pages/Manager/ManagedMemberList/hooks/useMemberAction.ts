import { type MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ClubMember } from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';
import { useRemoveManagedMemberMutation } from '@/pages/Manager/hooks/useManagedMemberMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';

import type { MenuAnchor } from '../components/ActionPopupMenu';

export default function useMemberAction(clubId: number) {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();

  const { mutate: removeMember, isPending: isRemoving } = useRemoveManagedMemberMutation(clubId);

  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<MenuAnchor | null>(null);

  const { value: isActionOpen, setTrue: openAction, setFalse: closeAction } = useBooleanState();
  const { value: isRemoveOpen, setTrue: openRemove, setFalse: closeRemove } = useBooleanState();

  const handleOpenAction = (member: ClubMember, event: MouseEvent<HTMLButtonElement>) => {
    const { bottom, right, top } = event.currentTarget.getBoundingClientRect();
    setSelectedMember(member);
    setActionMenuAnchor({ bottom, right, top });
    openAction();
  };

  const handleCloseAction = () => {
    closeAction();
    setActionMenuAnchor(null);
  };

  const handleOpenRemove = () => {
    closeAction();
    setActionMenuAnchor(null);
    openRemove();
  };

  const handleOpenApplication = () => {
    if (!selectedMember) return;
    closeAction();
    setActionMenuAnchor(null);
    navigate(`${selectedMember.userId}/application`);
  };

  const handleRemove = () => {
    if (!selectedMember) return;
    removeMember(selectedMember.userId, {
      onSuccess: () => showToast('부원이 추방되었습니다'),
      onError: (error) => showApiErrorToast(error, '부원 추방에 실패했습니다.'),
    });
    closeRemove();
    setSelectedMember(null);
  };

  return {
    isRemoving,
    selectedMember,
    actionMenuAnchor,
    isActionOpen,
    isRemoveOpen,
    closeRemove,
    handleOpenAction,
    handleCloseAction,
    handleOpenRemove,
    handleOpenApplication,
    handleRemove,
  } as const;
}
