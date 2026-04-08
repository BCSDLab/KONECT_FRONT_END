import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { ClubMember, PositionType } from '@/apis/club/entity';
import { managedClubQueryKeys } from '@/apis/club/managedQueries';
import { useToastContext } from '@/contexts/useToastContext';
import {
  useChangeManagedMemberPositionMutation,
  useChangeManagedVicePresidentMutation,
  useTransferManagedPresidentMutation,
} from '@/pages/Manager/hooks/useManagedMemberMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';

import type { RoleManageOption } from '../components/RoleManageSelector';

const PROTECTED_POSITIONS = new Set<PositionType>(['PRESIDENT', 'VICE_PRESIDENT']);

export default function useRoleManage(clubId: number, members: ClubMember[]) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();

  const { mutate: transferPresident, isPending: isTransferring } = useTransferManagedPresidentMutation(clubId);
  const { mutate: changeVicePresident, isPending: isChangingVP } = useChangeManagedVicePresidentMutation(clubId);
  const { mutateAsync: changeMemberPosition, isPending: isChangingPosition } =
    useChangeManagedMemberPositionMutation(clubId);

  const isPending = isTransferring || isChangingVP || isChangingPosition;

  const { value: isOpen, setTrue: open, setFalse: close } = useBooleanState();
  const [target, setTarget] = useState<RoleManageOption>('PRESIDENT');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const currentPresident = useMemo(() => members.find((m) => m.position === 'PRESIDENT') ?? null, [members]);
  const currentVicePresident = useMemo(() => members.find((m) => m.position === 'VICE_PRESIDENT') ?? null, [members]);
  const managerMembers = useMemo(() => members.filter((m) => m.position === 'MANAGER'), [members]);

  const vicePresidentCandidates = useMemo(() => members.filter((m) => m.position !== 'PRESIDENT'), [members]);
  const managerCandidates = useMemo(() => members.filter((m) => !PROTECTED_POSITIONS.has(m.position)), [members]);

  const roleManageMembers = useMemo(() => {
    switch (target) {
      case 'PRESIDENT':
        return members;
      case 'VICE_PRESIDENT':
        return vicePresidentCandidates;
      case 'MANAGER':
        return managerCandidates;
    }
  }, [managerCandidates, members, target, vicePresidentCandidates]);

  const getInitialSelection = (t: RoleManageOption) => {
    if (t === 'PRESIDENT') return new Set(currentPresident ? [currentPresident.userId] : []);
    if (t === 'VICE_PRESIDENT') return new Set(currentVicePresident ? [currentVicePresident.userId] : []);
    return new Set(managerMembers.map((m) => m.userId));
  };

  const handleOpen = () => {
    setTarget('PRESIDENT');
    setSelectedUserIds(getInitialSelection('PRESIDENT'));
    open();
  };

  const handleChangeTarget = (t: RoleManageOption) => {
    setTarget(t);
    setSelectedUserIds(getInitialSelection(t));
  };

  const handleMemberClick = (userId: number) => {
    if (target === 'MANAGER') {
      setSelectedUserIds((prev) => {
        const next = new Set(prev);
        if (next.has(userId)) {
          next.delete(userId);
        } else {
          next.add(userId);
        }
        return next;
      });
      return;
    }

    if (target === 'VICE_PRESIDENT') {
      setSelectedUserIds((prev) => {
        if (prev.has(userId) && prev.size === 1) return new Set();
        return new Set([userId]);
      });
      return;
    }

    setSelectedUserIds(new Set([userId]));
  };

  const handleSubmit = async () => {
    if (target === 'PRESIDENT') {
      const nextPresidentId = selectedUserIds.values().next().value as number | undefined;
      if (!nextPresidentId || nextPresidentId === currentPresident?.userId) {
        close();
        return;
      }
      close();
      transferPresident(
        { newPresidentUserId: nextPresidentId },
        {
          onSuccess: () => {
            showToast('회장이 위임되었습니다');
            navigate(-1);
          },
          onError: (error) => showApiErrorToast(error, '회장 위임에 실패했습니다.'),
        }
      );
      return;
    }

    if (target === 'VICE_PRESIDENT') {
      const nextVicePresidentId = (selectedUserIds.values().next().value as number | undefined) ?? null;
      if (nextVicePresidentId === (currentVicePresident?.userId ?? null)) {
        close();
        return;
      }
      close();
      changeVicePresident(
        { vicePresidentUserId: nextVicePresidentId },
        {
          onSuccess: () => showToast('부회장이 변경되었습니다'),
          onError: (error) => showApiErrorToast(error, '부회장 변경에 실패했습니다.'),
        }
      );
      return;
    }

    const currentManagerUserIds = new Set(managerMembers.map((m) => m.userId));
    const promoteUserIds = [...selectedUserIds].filter((id) => !currentManagerUserIds.has(id));
    const demoteUserIds = [...currentManagerUserIds].filter((id) => !selectedUserIds.has(id));

    if (promoteUserIds.length === 0 && demoteUserIds.length === 0) {
      close();
      return;
    }

    try {
      await Promise.all(
        promoteUserIds.map((userId) => changeMemberPosition({ userId, data: { position: 'MANAGER' } }))
      );
      await Promise.all(demoteUserIds.map((userId) => changeMemberPosition({ userId, data: { position: 'MEMBER' } })));
      showToast('직책이 변경되었습니다');
    } catch (error) {
      showApiErrorToast(error, '일부 직책 변경에 실패했습니다.');
    } finally {
      await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
      close();
    }
  };

  return {
    isOpen,
    isPending,
    target,
    selectedUserIds,
    roleManageMembers,
    managerMembers,
    close,
    handleOpen,
    handleChangeTarget,
    handleMemberClick,
    handleSubmit,
  } as const;
}
