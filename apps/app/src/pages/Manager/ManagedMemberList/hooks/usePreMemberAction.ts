import { type MouseEvent, useState } from 'react';

import type { PreMember } from '@/apis/club/entity';
import { useToastContext } from '@/contexts/useToastContext';
import { useDeleteManagedPreMemberMutation } from '@/pages/Manager/hooks/useManagedMemberMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';

import type { MenuAnchor } from '../components/ActionPopupMenu';

export default function usePreMemberAction(clubId: number) {
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();

  const { mutate: deletePreMember, isPending: isDeletingPreMember } = useDeleteManagedPreMemberMutation(clubId);

  const [selectedPreMember, setSelectedPreMember] = useState<PreMember | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<MenuAnchor | null>(null);

  const { value: isActionOpen, setTrue: openAction, setFalse: closeAction } = useBooleanState();
  const { value: isDeleteOpen, setTrue: openDelete, setFalse: closeDelete } = useBooleanState();

  const handleOpenAction = (member: PreMember, event: MouseEvent<HTMLButtonElement>) => {
    const { bottom, right, top } = event.currentTarget.getBoundingClientRect();
    setSelectedPreMember(member);
    setActionMenuAnchor({ bottom, right, top });
    openAction();
  };

  const handleCloseAction = () => {
    closeAction();
    setActionMenuAnchor(null);
  };

  const handleOpenDelete = () => {
    closeAction();
    setActionMenuAnchor(null);
    openDelete();
  };

  const handleDelete = () => {
    if (!selectedPreMember) return;
    deletePreMember(selectedPreMember.preMemberId, {
      onSuccess: () => showToast('사전 등록 회원이 삭제되었습니다'),
      onError: (error) => showApiErrorToast(error, '사전 등록 회원 삭제에 실패했습니다.'),
    });
    closeDelete();
    setSelectedPreMember(null);
  };

  return {
    isDeletingPreMember,
    selectedPreMember,
    actionMenuAnchor,
    isActionOpen,
    isDeleteOpen,
    closeDelete,
    handleOpenAction,
    handleCloseAction,
    handleOpenDelete,
    handleDelete,
  } as const;
}
