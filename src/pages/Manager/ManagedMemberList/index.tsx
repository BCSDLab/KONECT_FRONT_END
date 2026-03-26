import { type MouseEvent, type ReactNode, useMemo, useRef, useState } from 'react';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClubMember, PositionType, PreMember } from '@/apis/club/entity';
import {
  useAddManagedPreMemberMutation,
  useChangeManagedMemberPositionMutation,
  useChangeManagedVicePresidentMutation,
  useDeleteManagedPreMemberMutation,
  useRemoveManagedMemberMutation,
  useTransferManagedPresidentMutation,
} from '@/apis/club/managedHooks';
import { managedClubQueries, managedClubQueryKeys } from '@/apis/club/managedQueries';
import CheckIcon from '@/assets/svg/check.svg';
import MoreHorizontalIcon from '@/assets/svg/more-horizontal.svg';
import RoleSelectorArrowDownIcon from '@/assets/svg/role-selector-arrow-down.svg';
import BottomModal from '@/components/common/BottomModal';
import Portal from '@/components/common/Portal';
import { useToastContext } from '@/contexts/useToastContext';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClickTouchOutside from '@/utils/hooks/useClickTouchOutside';

const POSITION_LABELS: Record<PositionType, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '운영진',
  MEMBER: '부원',
};

const PROTECTED_POSITIONS = new Set<PositionType>(['PRESIDENT', 'VICE_PRESIDENT']);
const ACTION_MENU_WIDTH = 195;
const ACTION_MENU_OFFSET = 8;
const ACTION_MENU_MARGIN = 16;
const ROLE_OPTIONS = [
  { label: '회장', value: 'PRESIDENT' },
  { label: '부회장', value: 'VICE_PRESIDENT' },
  { label: '운영진', value: 'MANAGER' },
] as const;

type RoleManageOption = (typeof ROLE_OPTIONS)[number]['value'];

interface MenuAnchor {
  bottom: number;
  right: number;
  top: number;
}

interface PopupMenuItem {
  label: string;
  onClick: () => void;
  tone?: 'danger' | 'default';
}

function RoleManageSelector({
  onChange,
  value,
}: {
  onChange: (value: RoleManageOption) => void;
  value: RoleManageOption;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);

  useClickTouchOutside(selectorRef, () => setIsOpen(false));

  const selectedOption = ROLE_OPTIONS.find((option) => option.value === value);

  return (
    <div ref={selectorRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[29px] min-w-[72px] items-center rounded-full border border-[#A5B3C1] bg-white pr-2 pl-[18px]"
      >
        <span className="text-sub2 text-text-600">{selectedOption?.label}</span>
        <RoleSelectorArrowDownIcon className="text-text-600 ml-0.5 h-[29.5px] w-[29.5px]" />
      </button>

      {isOpen && (
        <div className="absolute top-[31px] left-0 z-10 w-[72px] overflow-hidden rounded-[10px] border border-[#A5B3C1] bg-white">
          {ROLE_OPTIONS.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`text-sub2 text-text-600 w-full px-3 py-[3px] text-left ${
                index !== ROLE_OPTIONS.length - 1 ? 'border-b border-[#C6CFD8]' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MemberAvatar({ name }: { name: string }) {
  return (
    <div
      className="bg-indigo-25 flex h-10 w-10 items-center justify-center rounded-[10px] text-[15px] leading-6 font-medium text-indigo-400"
      aria-hidden="true"
    >
      {name.charAt(0)}
    </div>
  );
}

interface MemberCardProps {
  disabled?: boolean;
  name: string;
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  positionLabel: string;
  showAction?: boolean;
  studentNumber: string;
}

function MemberCard({
  disabled = false,
  name,
  onAction,
  positionLabel,
  showAction = false,
  studentNumber,
}: MemberCardProps) {
  return (
    <div className="border-indigo-5 flex items-center justify-between rounded-2xl border bg-white p-3">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <MemberAvatar name={name} />
        <div className="min-w-0">
          <div className="truncate text-[15px] leading-6 font-semibold text-indigo-700">
            {name} ({studentNumber})
          </div>
          <div className="text-[13px] leading-[1.6] font-medium text-indigo-300">{positionLabel}</div>
        </div>
      </div>

      {showAction && onAction && (
        <button
          type="button"
          onClick={(event) => onAction(event)}
          disabled={disabled}
          aria-label={`${name} 관리`}
          className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-indigo-300 disabled:opacity-50"
        >
          <MoreHorizontalIcon className="h-2 w-[13px]" />
        </button>
      )}
    </div>
  );
}

function ActionPopupMenu({
  anchor,
  isOpen,
  items,
  onClose,
}: {
  anchor: MenuAnchor | null;
  isOpen: boolean;
  items: PopupMenuItem[];
  onClose: () => void;
}) {
  if (!isOpen || !anchor) return null;

  const popupHeight = 24 + items.length * 22 + Math.max(0, items.length - 1) * 8;
  const left = Math.min(
    Math.max(anchor.right - ACTION_MENU_WIDTH, ACTION_MENU_MARGIN),
    window.innerWidth - ACTION_MENU_WIDTH - ACTION_MENU_MARGIN
  );
  const top =
    anchor.bottom + ACTION_MENU_OFFSET + popupHeight <= window.innerHeight - ACTION_MENU_MARGIN
      ? anchor.bottom + ACTION_MENU_OFFSET
      : Math.max(ACTION_MENU_MARGIN, anchor.top - popupHeight - ACTION_MENU_OFFSET);

  return (
    <Portal>
      <div className="fixed inset-0 z-100" onClick={onClose}>
        <div
          role="menu"
          aria-orientation="vertical"
          className="fixed w-[195px] overflow-hidden rounded-[10px] border border-[#C6CFD8] bg-white p-3"
          style={{ left, top }}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
          onTouchStart={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-2 pl-0.5">
            {items.map(({ label, onClick, tone = 'default' }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={onClick}
                className={`text-sub2 text-left ${tone === 'danger' ? 'text-[#FF4E4E]' : 'text-text-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}

function MemberSection({ title, children }: { children: ReactNode; title: string }) {
  return (
    <section className="flex flex-col gap-1">
      <h2 className="px-px text-[14px] leading-[1.6] font-medium text-indigo-500">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function ManagedMemberList() {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clubId = Number(params.clubId);
  const { showToast } = useToastContext();

  const { data: managedMemberList } = useSuspenseQuery(managedClubQueries.members(clubId));

  const { mutate: transferPresident, isPending: isTransferring } = useTransferManagedPresidentMutation(clubId);
  const { mutate: changeVicePresident, isPending: isChangingVP } = useChangeManagedVicePresidentMutation(clubId);
  const { mutateAsync: changeMemberPosition, isPending: isChangingPosition } = useChangeManagedMemberPositionMutation(
    clubId,
    {
      invalidateOnSuccess: false,
    }
  );
  const { mutate: removeMember, isPending: isRemoving } = useRemoveManagedMemberMutation(clubId);
  const { mutate: addPreMember, isPending: isAdding } = useAddManagedPreMemberMutation(clubId);

  const { data: preMembersList } = useSuspenseQuery(managedClubQueries.preMembers(clubId));
  const { mutate: deletePreMemberMutate, isPending: isDeletingPreMember } = useDeleteManagedPreMemberMutation(clubId);

  const isPending =
    isTransferring || isChangingVP || isChangingPosition || isRemoving || isAdding || isDeletingPreMember;

  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);
  const [selectedPreMember, setSelectedPreMember] = useState<PreMember | null>(null);

  const { value: isRoleManageOpen, setTrue: openRoleManage, setFalse: closeRoleManage } = useBooleanState();
  const { value: isActionOpen, setTrue: openAction, setFalse: closeAction } = useBooleanState();
  const { value: isRemoveOpen, setTrue: openRemove, setFalse: closeRemove } = useBooleanState();
  const { value: isAddOpen, setTrue: openAdd, setFalse: closeAdd } = useBooleanState();
  const {
    value: isPreMemberActionOpen,
    setTrue: openPreMemberAction,
    setFalse: closePreMemberAction,
  } = useBooleanState();
  const {
    value: isPreMemberDeleteOpen,
    setTrue: openPreMemberDelete,
    setFalse: closePreMemberDelete,
  } = useBooleanState();

  const [roleManageTarget, setRoleManageTarget] = useState<RoleManageOption>('PRESIDENT');
  const [selectedRoleUserIds, setSelectedRoleUserIds] = useState<Set<number>>(new Set());
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [actionMenuAnchor, setActionMenuAnchor] = useState<MenuAnchor | null>(null);
  const [preMemberActionMenuAnchor, setPreMemberActionMenuAnchor] = useState<MenuAnchor | null>(null);

  const members = managedMemberList.clubMembers;
  const total = members.length;

  const protectedMembers = useMemo(
    () => members.filter((member) => PROTECTED_POSITIONS.has(member.position)),
    [members]
  );
  const currentPresident = useMemo(() => members.find((member) => member.position === 'PRESIDENT') ?? null, [members]);
  const managerMembers = useMemo(() => members.filter((member) => member.position === 'MANAGER'), [members]);
  const generalMembers = useMemo(() => members.filter((member) => member.position === 'MEMBER'), [members]);
  const currentVicePresident = useMemo(
    () => members.find((member) => member.position === 'VICE_PRESIDENT') ?? null,
    [members]
  );

  const vicePresidentCandidates = useMemo(() => members.filter((member) => member.position !== 'PRESIDENT'), [members]);
  const managerCandidates = useMemo(
    () => members.filter((member) => !PROTECTED_POSITIONS.has(member.position)),
    [members]
  );

  const roleManageMembers = useMemo(() => {
    switch (roleManageTarget) {
      case 'PRESIDENT':
        return members;
      case 'VICE_PRESIDENT':
        return vicePresidentCandidates;
      case 'MANAGER':
        return managerCandidates;
    }
  }, [managerCandidates, members, roleManageTarget, vicePresidentCandidates]);

  const getInitialRoleSelection = (target: RoleManageOption) => {
    if (target === 'PRESIDENT') {
      return new Set(currentPresident ? [currentPresident.userId] : []);
    }

    if (target === 'VICE_PRESIDENT') {
      return new Set(currentVicePresident ? [currentVicePresident.userId] : []);
    }

    return new Set(managerMembers.map((member) => member.userId));
  };

  const handleMemberAction = (member: ClubMember, event: MouseEvent<HTMLButtonElement>) => {
    const { bottom, right, top } = event.currentTarget.getBoundingClientRect();
    setSelectedMember(member);
    setActionMenuAnchor({ bottom, right, top });
    openAction();
  };

  const handleOpenRoleManage = () => {
    setRoleManageTarget('PRESIDENT');
    setSelectedRoleUserIds(getInitialRoleSelection('PRESIDENT'));
    openRoleManage();
  };

  const handleChangeRoleManageTarget = (target: RoleManageOption) => {
    setRoleManageTarget(target);
    setSelectedRoleUserIds(getInitialRoleSelection(target));
  };

  const handleOpenRemove = () => {
    closeAction();
    setActionMenuAnchor(null);
    openRemove();
  };

  const handleOpenMemberApplication = () => {
    if (!selectedMember) return;
    closeAction();
    setActionMenuAnchor(null);
    navigate(`${selectedMember.userId}/application`);
  };

  const handleRoleMemberClick = (userId: number) => {
    if (roleManageTarget === 'MANAGER') {
      setSelectedRoleUserIds((prev) => {
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

    if (roleManageTarget === 'VICE_PRESIDENT') {
      setSelectedRoleUserIds((prev) => {
        if (prev.has(userId) && prev.size === 1) {
          return new Set();
        }

        return new Set([userId]);
      });

      return;
    }

    setSelectedRoleUserIds(new Set([userId]));
  };

  const handleSubmitRoleManage = async () => {
    if (roleManageTarget === 'PRESIDENT') {
      const nextPresidentId = selectedRoleUserIds.values().next().value as number | undefined;

      if (!nextPresidentId || nextPresidentId === currentPresident?.userId) {
        closeRoleManage();
        return;
      }

      closeRoleManage();
      transferPresident(
        { newPresidentUserId: nextPresidentId },
        {
          onSuccess: () => {
            showToast('회장이 위임되었습니다');
            navigate(-1);
          },
        }
      );
      return;
    }

    if (roleManageTarget === 'VICE_PRESIDENT') {
      const nextVicePresidentId = (selectedRoleUserIds.values().next().value as number | undefined) ?? null;

      if (nextVicePresidentId === (currentVicePresident?.userId ?? null)) {
        closeRoleManage();
        return;
      }

      closeRoleManage();
      changeVicePresident(
        { vicePresidentUserId: nextVicePresidentId },
        {
          onSuccess: () => showToast('부회장이 변경되었습니다'),
        }
      );
      return;
    }

    const currentManagerUserIds = new Set(managerMembers.map((member) => member.userId));
    const promoteUserIds = [...selectedRoleUserIds].filter((userId) => !currentManagerUserIds.has(userId));
    const demoteUserIds = [...currentManagerUserIds].filter((userId) => !selectedRoleUserIds.has(userId));

    if (promoteUserIds.length === 0 && demoteUserIds.length === 0) {
      closeRoleManage();
      return;
    }

    await Promise.all(promoteUserIds.map((userId) => changeMemberPosition({ userId, data: { position: 'MANAGER' } })));

    await Promise.all(demoteUserIds.map((userId) => changeMemberPosition({ userId, data: { position: 'MEMBER' } })));

    await queryClient.invalidateQueries({ queryKey: managedClubQueryKeys.members(clubId) });
    showToast('직책이 변경되었습니다');
    closeRoleManage();
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    removeMember(selectedMember.userId, {
      onSuccess: () => showToast('부원이 추방되었습니다'),
    });
    closeRemove();
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    if (!newStudentNumber || !newMemberName) return;
    addPreMember(
      { studentNumber: newStudentNumber, name: newMemberName },
      {
        onSuccess: () => showToast('부원이 추가되었습니다'),
      }
    );
    closeAdd();
    setNewStudentNumber('');
    setNewMemberName('');
  };

  const handlePreMemberAction = (member: PreMember, event: MouseEvent<HTMLButtonElement>) => {
    const { bottom, right, top } = event.currentTarget.getBoundingClientRect();
    setSelectedPreMember(member);
    setPreMemberActionMenuAnchor({ bottom, right, top });
    openPreMemberAction();
  };

  const handleOpenPreMemberDelete = () => {
    closePreMemberAction();
    setPreMemberActionMenuAnchor(null);
    openPreMemberDelete();
  };

  const handleDeletePreMember = () => {
    if (!selectedPreMember) return;
    deletePreMemberMutate(selectedPreMember.preMemberId, {
      onSuccess: () => showToast('사전 등록 회원이 삭제되었습니다'),
    });
    closePreMemberDelete();
    setSelectedPreMember(null);
  };

  return (
    <div className="flex flex-col gap-9 px-[19px] py-[17px]">
      <UserInfoCard type="detail" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="border-indigo-5 flex items-center justify-center rounded-2xl border bg-white px-3 py-3">
            <span className="text-[15px] leading-6 font-semibold text-indigo-400">총 부원수 : {total}명</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenRoleManage}
              disabled={isPending}
              className="border-indigo-5 flex-1 rounded-2xl border bg-[#69BFDF] px-4 py-1.5 text-[15px] leading-6 font-semibold text-white disabled:opacity-50"
            >
              직책 변경
            </button>
            <button
              type="button"
              onClick={openAdd}
              disabled={isPending}
              className="border-indigo-5 flex-1 rounded-2xl border bg-[#69BFDF] px-4 py-1.5 text-[15px] leading-6 font-semibold text-white disabled:opacity-50"
            >
              부원 추가
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {protectedMembers.length > 0 && (
            <div className="flex flex-col gap-2">
              {protectedMembers.map((member) => (
                <MemberCard
                  key={member.userId}
                  name={member.name}
                  positionLabel={POSITION_LABELS[member.position]}
                  studentNumber={member.studentNumber}
                />
              ))}
            </div>
          )}

          {managerMembers.length > 0 && (
            <MemberSection title="운영진">
              {managerMembers.map((member) => (
                <MemberCard
                  key={member.userId}
                  disabled={isPending}
                  name={member.name}
                  onAction={(event) => handleMemberAction(member, event)}
                  positionLabel={POSITION_LABELS[member.position]}
                  showAction
                  studentNumber={member.studentNumber}
                />
              ))}
            </MemberSection>
          )}

          {generalMembers.length > 0 && (
            <MemberSection title="일반 부원">
              {generalMembers.map((member) => (
                <MemberCard
                  key={member.userId}
                  disabled={isPending}
                  name={member.name}
                  onAction={(event) => handleMemberAction(member, event)}
                  positionLabel={POSITION_LABELS[member.position]}
                  showAction
                  studentNumber={member.studentNumber}
                />
              ))}
            </MemberSection>
          )}

          {preMembersList.preMembers.length > 0 && (
            <MemberSection title="사전 등록 회원">
              {preMembersList.preMembers.map((member) => (
                <MemberCard
                  key={member.preMemberId}
                  disabled={isPending}
                  name={member.name}
                  onAction={(event) => handlePreMemberAction(member, event)}
                  positionLabel="사전 등록"
                  showAction
                  studentNumber={member.studentNumber}
                />
              ))}
            </MemberSection>
          )}
        </div>
      </div>

      <ActionPopupMenu
        anchor={actionMenuAnchor}
        isOpen={isActionOpen}
        onClose={() => {
          closeAction();
          setActionMenuAnchor(null);
        }}
        items={[
          {
            label: '지원서 보기',
            onClick: handleOpenMemberApplication,
          },
          {
            label: '부원 삭제',
            onClick: handleOpenRemove,
            tone: 'danger',
          },
        ]}
      />

      <ActionPopupMenu
        anchor={preMemberActionMenuAnchor}
        isOpen={isPreMemberActionOpen}
        onClose={() => {
          closePreMemberAction();
          setPreMemberActionMenuAnchor(null);
        }}
        items={[
          {
            label: '사전 등록 삭제',
            onClick: handleOpenPreMemberDelete,
            tone: 'danger',
          },
        ]}
      />

      <BottomModal
        isOpen={isRoleManageOpen}
        onClose={closeRoleManage}
        className="h-[660px] max-h-[calc(var(--viewport-height)-184px)] rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
        overlayClassName="bg-black/50"
      >
        <div className="flex h-full flex-col">
          <div className="border-indigo-25 border-b px-[27px] py-[18px]">
            <h2 className="text-text-700 text-[16px] leading-[1.6] font-semibold">직책 변경</h2>
          </div>

          <div className="px-5 pt-[18px]">
            <RoleManageSelector value={roleManageTarget} onChange={handleChangeRoleManageTarget} />
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-6 pt-[34px]">
            <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-auto">
              {roleManageMembers.map((member) => {
                const isSelected = selectedRoleUserIds.has(member.userId);

                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => handleRoleMemberClick(member.userId)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <MemberAvatar name={member.name} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[15px] leading-[1.6] font-semibold text-indigo-700">
                        {member.name} ({member.studentNumber})
                      </div>
                    </div>
                    {isSelected && <CheckIcon className="h-[26px] w-[26px] text-[#69BFDF]" />}
                  </button>
                );
              })}
            </div>

            <div className="px-[18px] pt-6 pb-5">
              <button
                type="button"
                onClick={() => void handleSubmitRoleManage()}
                disabled={isPending}
                className="text-h2 h-12 w-full rounded-2xl bg-[#69BFDF] text-white disabled:opacity-50"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      </BottomModal>

      <BottomModal
        isOpen={isRemoveOpen}
        onClose={closeRemove}
        className="rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
        overlayClassName="bg-black/50"
      >
        <div className="flex flex-col pb-[15px]">
          <div className="border-indigo-25 border-b px-[27px] py-[18px]">
            <h2 className="text-text-700 text-[16px] leading-[1.6] font-semibold">부원 삭제</h2>
          </div>

          <div className="px-[27px] pt-5">
            <p className="text-text-700 text-[15px] leading-[1.6] font-medium">
              정말 {selectedMember?.name}님을 삭제하시겠어요?
            </p>
          </div>

          <div className="flex gap-3 px-[21px] pt-[22px]">
            <button
              type="button"
              onClick={closeRemove}
              className="h-[55px] flex-1 rounded-2xl border border-[#69BFDF] text-center text-[16px] leading-[22px] font-bold tracking-[-0.408px] text-[#69BFDF]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleRemoveMember}
              disabled={isPending}
              className="h-[55px] flex-1 rounded-2xl border border-[#69BFDF] bg-[#69BFDF] text-center text-[16px] leading-[22px] font-bold tracking-[-0.408px] text-white disabled:opacity-50"
            >
              {isRemoving ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </BottomModal>

      <BottomModal
        isOpen={isAddOpen}
        onClose={closeAdd}
        className="rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
        overlayClassName="bg-black/50"
      >
        <div className="flex flex-col pb-6">
          <div className="flex items-center justify-center py-3">
            <div className="h-1 w-11 rounded-full bg-indigo-200" />
          </div>

          <div className="flex flex-col gap-3 px-6 pt-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-h2 text-black">부원 추가하기</h2>
              <p className="text-sub2 text-indigo-400">서비스에 가입하지 않은 학생을 사전 등록해주세요.</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pre-member-student-number" className="text-sub3 text-text-700">
                학번
              </label>
              <input
                id="pre-member-student-number"
                type="text"
                inputMode="numeric"
                value={newStudentNumber}
                onChange={(e) => setNewStudentNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="학번을 입력해주세요."
                className="text-sub3 h-9 rounded-2xl border border-[#C6CFD8] px-3 text-indigo-700 outline-none placeholder:text-[#8497AA] focus:border-[#69BFDF]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pre-member-name" className="text-sub3 text-text-700">
                이름
              </label>
              <input
                id="pre-member-name"
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="이름을 입력해주세요."
                className="text-sub3 h-9 rounded-2xl border border-[#C6CFD8] px-3 text-indigo-700 outline-none placeholder:text-[#8497AA] focus:border-[#69BFDF]"
              />
            </div>
          </div>

          <div className="px-[18px] pt-6">
            <button
              type="button"
              onClick={handleAddMember}
              disabled={!newStudentNumber || !newMemberName || isPending}
              className="text-h2 h-12 w-full rounded-2xl bg-[#69BFDF] text-white disabled:bg-[#B7DDEE]"
            >
              {isAdding ? '추가 중...' : '추가'}
            </button>
          </div>
        </div>
      </BottomModal>

      <BottomModal isOpen={isPreMemberDeleteOpen} onClose={closePreMemberDelete}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">사전 등록 삭제</div>
          <div className="text-body3 text-indigo-400">
            정말 {selectedPreMember?.name}님의 사전 등록을 삭제하시겠어요?
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closePreMemberDelete}
              className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDeletePreMember}
              disabled={isPending}
              className="flex-1 rounded-lg bg-red-500 py-3 text-center font-bold text-white disabled:opacity-50"
            >
              {isDeletingPreMember ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedMemberList;
