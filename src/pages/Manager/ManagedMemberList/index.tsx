import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import type { ClubMember, PositionType, preMember } from '@/apis/club/entity';
import CheckIcon from '@/assets/svg/check.svg';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import Toast from '@/components/common/Toast';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useToast } from '@/utils/hooks/useToast';
import {
  useAddPreMember,
  useChangeMemberPosition,
  useChangeVicePresident,
  useDeletePreMember,
  useGetPreMemberList,
  useManagedMembers,
  useRemoveMember,
  useTransferPresident,
} from '../hooks/useManagerQuery';

const POSITION_PRIORITY: Record<PositionType, number> = {
  PRESIDENT: 0,
  VICE_PRESIDENT: 1,
  MANAGER: 2,
  MEMBER: 3,
};

const POSITION_LABELS: Record<PositionType, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '운영진',
  MEMBER: '일반 회원',
};

const PROTECTED_POSITIONS = new Set<PositionType>(['PRESIDENT', 'VICE_PRESIDENT']);

function groupMembers(members: ClubMember[]) {
  const grouped = new Map<PositionType, ClubMember[]>();
  for (const member of members) {
    const pos = member.position;
    if (!grouped.has(pos)) {
      grouped.set(pos, []);
    }
    grouped.get(pos)!.push(member);
  }
  const sorted = [...grouped.entries()].sort(([a], [b]) => POSITION_PRIORITY[a] - POSITION_PRIORITY[b]);
  return sorted;
}

function ManagedMemberList() {
  const params = useParams();
  const clubId = Number(params.clubId);

  const { toast, showToast, hideToast } = useToast();
  const { managedMemberList } = useManagedMembers(clubId);

  const { mutate: transferPresident, isPending: isTransferring } = useTransferPresident(clubId, {
    onSuccess: () => showToast('회장이 위임되었습니다'),
  });
  const { mutate: changeVicePresident, isPending: isChangingVP } = useChangeVicePresident(clubId, {
    onSuccess: () => showToast('부회장이 변경되었습니다'),
  });
  const { mutate: changeMemberPosition, isPending: isChangingPosition } = useChangeMemberPosition(clubId, {
    onSuccess: () => showToast('직책이 변경되었습니다'),
  });
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(clubId, {
    onSuccess: () => showToast('부원이 추방되었습니다'),
  });
  const { mutate: addPreMember, isPending: isAdding } = useAddPreMember(clubId, {
    onSuccess: () => showToast('부원이 추가되었습니다'),
  });

  const { preMembersList } = useGetPreMemberList(clubId);
  const { mutate: deletePreMemberMutate, isPending: isDeletingPreMember } = useDeletePreMember(clubId, {
    onSuccess: () => showToast('사전 등록 회원이 삭제되었습니다'),
  });

  const isPending =
    isTransferring || isChangingVP || isChangingPosition || isRemoving || isAdding || isDeletingPreMember;

  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);
  const [selectedPreMember, setSelectedPreMember] = useState<preMember | null>(null);

  const { value: isActionOpen, setTrue: openAction, setFalse: closeAction } = useBooleanState();
  const { value: isTransferOpen, setTrue: openTransfer, setFalse: closeTransfer } = useBooleanState();
  const { value: isVPOpen, setTrue: openVP, setFalse: closeVP } = useBooleanState();
  const { value: isPositionOpen, setTrue: openPosition, setFalse: closePosition } = useBooleanState();
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

  const [transferTarget, setTransferTarget] = useState<number | null>(null);
  const [vpTarget, setVPTarget] = useState<number | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<'MANAGER' | 'MEMBER' | null>(null);
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newMemberName, setNewMemberName] = useState('');

  const members = managedMemberList.clubMembers;

  const groupedEntries = useMemo(() => groupMembers(members), [members]);
  const total = members.length;

  const nonPresidentMembers = members.filter((m) => !PROTECTED_POSITIONS.has(m.position));

  const handleMemberAction = (member: ClubMember) => {
    setSelectedMember(member);
    openAction();
  };

  const handleOpenPositionChange = () => {
    closeAction();
    setSelectedPosition(null);
    openPosition();
  };

  const handleOpenRemove = () => {
    closeAction();
    openRemove();
  };

  const handleTransferPresident = () => {
    if (transferTarget === null) return;
    transferPresident({ newPresidentUserId: transferTarget });
    closeTransfer();
  };

  const handleChangeVP = () => {
    changeVicePresident({ vicePresidentUserId: vpTarget });
    closeVP();
  };

  const handleChangePosition = () => {
    if (!selectedMember || selectedPosition === null) return;
    changeMemberPosition({
      userId: selectedMember.userId,
      data: { position: selectedPosition },
    });
    closePosition();
    setSelectedMember(null);
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    removeMember(selectedMember.userId);
    closeRemove();
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    if (!newStudentNumber || !newMemberName) return;
    addPreMember({ studentNumber: newStudentNumber, name: newMemberName });
    closeAdd();
    setNewStudentNumber('');
    setNewMemberName('');
  };

  const handlePreMemberAction = (member: preMember) => {
    setSelectedPreMember(member);
    openPreMemberAction();
  };

  const handleOpenPreMemberDelete = () => {
    closePreMemberAction();
    openPreMemberDelete();
  };

  const handleDeletePreMember = () => {
    if (!selectedPreMember) return;
    deletePreMemberMutate(selectedPreMember.preMemberId);
    closePreMemberDelete();
    setSelectedPreMember(null);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-3">
        <UserInfoCard type="detail" />

        <Card className="text-body3 flex-row">
          <div className="bg-indigo-5 flex-1 rounded-sm p-2 text-center">총 부원 수 : {total}명</div>
        </Card>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={openTransfer}
            disabled={isPending}
            className="bg-primary flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            회장 위임
          </button>
          <button
            type="button"
            onClick={openVP}
            disabled={isPending}
            className="bg-primary flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            부회장 변경
          </button>
          <button
            type="button"
            onClick={openAdd}
            disabled={isPending}
            className="bg-primary flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            부원 추가
          </button>
        </div>

        {groupedEntries.map(([position, groupMembers]) => (
          <div key={position} className="flex flex-col gap-1">
            <div className="text-body2 px-1 py-1 font-semibold text-indigo-700">{POSITION_LABELS[position]}</div>
            {groupMembers.map((member) => (
              <Card key={member.userId} className="flex-row items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <img className="h-10 w-10 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
                  <div>
                    <div className="text-body2 text-indigo-700">
                      {member.name} <span className="text-body3 text-indigo-400">({member.studentNumber})</span>
                    </div>
                    <div className="text-cap1 text-indigo-300">{POSITION_LABELS[member.position]}</div>
                  </div>
                </div>
                {!PROTECTED_POSITIONS.has(position) && (
                  <button
                    type="button"
                    onClick={() => handleMemberAction(member)}
                    disabled={isPending}
                    className="hover:bg-indigo-5 rounded-full p-2 text-indigo-400 disabled:opacity-50"
                  >
                    ⋯
                  </button>
                )}
              </Card>
            ))}
          </div>
        ))}

        {preMembersList.preMembers.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="text-body2 px-1 py-1 font-semibold text-indigo-700">사전 등록 회원</div>
            {preMembersList.preMembers.map((member) => (
              <Card key={member.preMemberId} className="flex-row items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-400">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-body2 text-indigo-700">
                      {member.name} <span className="text-body3 text-indigo-400">({member.studentNumber})</span>
                    </div>
                    <div className="text-cap1 text-indigo-300">사전 등록</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreMemberAction(member)}
                  disabled={isPending}
                  className="hover:bg-indigo-5 rounded-full p-2 text-indigo-400 disabled:opacity-50"
                >
                  ⋯
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Member Action Modal */}
      <BottomModal isOpen={isActionOpen} onClose={closeAction}>
        <div className="flex flex-col gap-2 p-5">
          <div className="text-body2 pb-2 font-semibold text-indigo-700">{selectedMember?.name} 관리</div>
          <button
            type="button"
            onClick={handleOpenPositionChange}
            className="text-body3 active:bg-indigo-5 rounded-lg py-3 text-left"
          >
            직책 변경
          </button>
          <button
            type="button"
            onClick={handleOpenRemove}
            className="text-body3 active:bg-indigo-5 rounded-lg py-3 text-left text-red-500"
          >
            부원 추방
          </button>
        </div>
      </BottomModal>

      {/* Transfer President Modal */}
      <BottomModal isOpen={isTransferOpen} onClose={closeTransfer}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">회장 위임</div>
          <div className="text-cap1 text-indigo-400">새 회장을 선택해주세요.</div>
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            {nonPresidentMembers.map((member) => {
              const isSelected = transferTarget === member.userId;
              return (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() => setTransferTarget(member.userId)}
                  className={`flex items-center justify-between rounded-lg p-2 ${
                    isSelected ? 'bg-indigo-5' : 'active:bg-indigo-5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img className="h-8 w-8 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
                    <div className={`text-body3 ${isSelected ? 'text-indigo-700' : 'text-indigo-400'}`}>
                      {member.name} ({member.studentNumber})
                    </div>
                  </div>
                  {isSelected && <CheckIcon className="h-4 w-4 text-blue-500" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleTransferPresident}
            disabled={transferTarget === null || isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isTransferring ? '위임 중...' : '확인'}
          </button>
        </div>
      </BottomModal>

      {/* Change Vice President Modal */}
      <BottomModal isOpen={isVPOpen} onClose={closeVP}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">부회장 변경</div>
          <div className="text-cap1 text-indigo-400">새 부회장을 선택하거나 해제해주세요.</div>
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            <button
              type="button"
              onClick={() => setVPTarget(null)}
              className={`flex items-center justify-between rounded-lg p-2 ${
                vpTarget === null ? 'bg-indigo-5' : 'active:bg-indigo-5'
              }`}
            >
              <div className={`text-body3 ${vpTarget === null ? 'text-red-500' : 'text-red-300'}`}>부회장 해제</div>
              {vpTarget === null && <CheckIcon className="h-4 w-4 text-blue-500" />}
            </button>
            {nonPresidentMembers.map((member) => {
              const isSelected = vpTarget === member.userId;
              return (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() => setVPTarget(member.userId)}
                  className={`flex items-center justify-between rounded-lg p-2 ${
                    isSelected ? 'bg-indigo-5' : 'active:bg-indigo-5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img className="h-8 w-8 rounded-full object-cover" src={member.imageUrl} alt={member.name} />
                    <div className={`text-body3 ${isSelected ? 'text-indigo-700' : 'text-indigo-400'}`}>
                      {member.name} ({member.studentNumber})
                    </div>
                  </div>
                  {isSelected && <CheckIcon className="h-4 w-4 text-blue-500" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleChangeVP}
            disabled={isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isChangingVP ? '변경 중...' : '확인'}
          </button>
        </div>
      </BottomModal>

      {/* Change Position Modal */}
      <BottomModal isOpen={isPositionOpen} onClose={closePosition}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">{selectedMember?.name} 직책 변경</div>
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            {(['MANAGER', 'MEMBER'] as const).map((position) => {
              const isSelected = selectedPosition === position;
              return (
                <button
                  key={position}
                  type="button"
                  onClick={() => setSelectedPosition(position)}
                  className={`flex items-center justify-between rounded-lg p-2 ${
                    isSelected ? 'bg-indigo-5' : 'active:bg-indigo-5'
                  }`}
                >
                  <div className={`text-body3 ${isSelected ? 'text-indigo-700' : 'text-indigo-400'}`}>
                    {POSITION_LABELS[position]}
                  </div>
                  {isSelected && <CheckIcon className="h-4 w-4 text-blue-500" />}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={handleChangePosition}
            disabled={selectedPosition === null || isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isChangingPosition ? '변경 중...' : '확인'}
          </button>
        </div>
      </BottomModal>

      {/* Remove Member Confirm Modal */}
      <BottomModal isOpen={isRemoveOpen} onClose={closeRemove}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">부원 추방</div>
          <div className="text-body3 text-indigo-400">정말 {selectedMember?.name}님을 추방하시겠어요?</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeRemove}
              className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleRemoveMember}
              disabled={isPending}
              className="flex-1 rounded-lg bg-red-500 py-3 text-center font-bold text-white disabled:opacity-50"
            >
              {isRemoving ? '추방 중...' : '추방'}
            </button>
          </div>
        </div>
      </BottomModal>

      {/* Add Member Modal */}
      <BottomModal isOpen={isAddOpen} onClose={closeAdd}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 font-semibold text-indigo-700">부원 추가</div>
          <div className="text-cap1 text-indigo-400">서비스에 가입하지 않은 학생을 사전 등록합니다.</div>
          <div className="flex flex-col gap-2">
            <label className="text-cap1 text-indigo-400">학번</label>
            <input
              type="text"
              value={newStudentNumber}
              onChange={(e) => setNewStudentNumber(e.target.value)}
              placeholder="학번을 입력해주세요"
              className="border-indigo-25 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-cap1 text-indigo-400">이름</label>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="border-indigo-25 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={!newStudentNumber || !newMemberName || isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isAdding ? '추가 중...' : '추가'}
          </button>
        </div>
      </BottomModal>

      {/* Pre-Member Action Modal */}
      <BottomModal isOpen={isPreMemberActionOpen} onClose={closePreMemberAction}>
        <div className="flex flex-col gap-2 p-5">
          <div className="text-body2 pb-2 font-semibold text-indigo-700">{selectedPreMember?.name} 관리</div>
          <button
            type="button"
            onClick={handleOpenPreMemberDelete}
            className="text-body3 active:bg-indigo-5 rounded-lg py-3 text-left text-red-500"
          >
            사전 등록 삭제
          </button>
        </div>
      </BottomModal>

      {/* Pre-Member Delete Confirm Modal */}
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

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}

export default ManagedMemberList;
