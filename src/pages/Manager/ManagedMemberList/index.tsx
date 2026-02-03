import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CheckIcon from '@/assets/svg/check.svg';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import type { ClubMember } from '@/apis/club/entity';
import useBooleanState from '@/utils/hooks/useBooleanState';
import {
  useAddMember,
  useChangeMemberPosition,
  useChangeVicePresident,
  useClubPositions,
  useManagedMembers,
  useRemoveMember,
  useTransferPresident,
} from '../hooks/useManagerQuery';

const POSITION_PRIORITY: Record<string, number> = {
  '회장': 0,
  '부회장': 1,
  '운영진': 2,
  '일반 회원': 3,
};

const PROTECTED_POSITIONS = new Set(['회장', '부회장']);

function groupMembers(members: ClubMember[]) {
  const grouped = new Map<string, ClubMember[]>();
  for (const member of members) {
    const pos = member.position;
    if (!grouped.has(pos)) {
      grouped.set(pos, []);
    }
    grouped.get(pos)!.push(member);
  }
  const sorted = [...grouped.entries()].sort(
    ([a], [b]) => (POSITION_PRIORITY[a] ?? 99) - (POSITION_PRIORITY[b] ?? 99),
  );
  return sorted;
}

function ManagedMemberList() {
  const params = useParams();
  const clubId = Number(params.clubId);

  const { managedMemberList } = useManagedMembers(clubId);
  const { clubPositions } = useClubPositions(clubId);

  const { mutate: transferPresident, isPending: isTransferring } = useTransferPresident(clubId);
  const { mutate: changeVicePresident, isPending: isChangingVP } = useChangeVicePresident(clubId);
  const { mutate: changeMemberPosition, isPending: isChangingPosition } = useChangeMemberPosition(clubId);
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember(clubId);
  const { mutate: addMember, isPending: isAdding } = useAddMember(clubId);

  const isPending = isTransferring || isChangingVP || isChangingPosition || isRemoving || isAdding;

  const [selectedMember, setSelectedMember] = useState<ClubMember | null>(null);

  const { value: isActionOpen, setTrue: openAction, setFalse: closeAction } = useBooleanState();
  const { value: isTransferOpen, setTrue: openTransfer, setFalse: closeTransfer } = useBooleanState();
  const { value: isVPOpen, setTrue: openVP, setFalse: closeVP } = useBooleanState();
  const { value: isPositionOpen, setTrue: openPosition, setFalse: closePosition } = useBooleanState();
  const { value: isRemoveOpen, setTrue: openRemove, setFalse: closeRemove } = useBooleanState();
  const { value: isAddOpen, setTrue: openAdd, setFalse: closeAdd } = useBooleanState();

  const [transferTarget, setTransferTarget] = useState<string | null>(null);
  const [vpTarget, setVPTarget] = useState<string | null>(null);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const [newStudentNumber, setNewStudentNumber] = useState('');
  const [newPositionId, setNewPositionId] = useState<number | null>(null);

  const members = managedMemberList.clubMembers;
  const positions = clubPositions.positions;

  const groupedEntries = useMemo(() => groupMembers(members), [members]);
  const total = members.length;

  const positionOptions = positions
    .filter((p) => p.positionGroup === 'MANAGER' || p.positionGroup === 'MEMBER')
    .map((p) => ({ value: String(p.positionId), label: p.name }));

  const nonPresidentMembers = members.filter((m) => !PROTECTED_POSITIONS.has(m.position));

  const handleMemberAction = (member: ClubMember) => {
    setSelectedMember(member);
    openAction();
  };

  const handleOpenPositionChange = () => {
    closeAction();
    setSelectedPositionId(null);
    openPosition();
  };

  const handleOpenRemove = () => {
    closeAction();
    openRemove();
  };

  const handleTransferPresident = () => {
    if (transferTarget === null) return;
    transferPresident({ newPresidentUserId: Number(transferTarget) });
    closeTransfer();
  };

  const handleChangeVP = () => {
    changeVicePresident({ vicePresidentUserId: vpTarget ? Number(vpTarget) : null });
    closeVP();
  };

  const handleChangePosition = () => {
    if (!selectedMember || selectedPositionId === null) return;
    changeMemberPosition({
      memberId: Number(selectedMember.studentNumber),
      data: { positionId: selectedPositionId },
    });
    closePosition();
    setSelectedMember(null);
  };

  const handleRemoveMember = () => {
    if (!selectedMember) return;
    removeMember(Number(selectedMember.studentNumber));
    closeRemove();
    setSelectedMember(null);
  };

  const handleAddMember = () => {
    if (!newStudentNumber || newPositionId === null) return;
    addMember({ userId: Number(newStudentNumber), positionId: newPositionId });
    closeAdd();
    setNewStudentNumber('');
    setNewPositionId(null);
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
            <div className="text-body2 text-indigo-700 px-1 py-1 font-semibold">
              {position}
            </div>
            {groupMembers.map((member) => (
              <Card key={member.studentNumber} className="flex-row items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={member.imageUrl}
                    alt={member.name}
                  />
                  <div>
                    <div className="text-body2 text-indigo-700">
                      {member.name}{' '}
                      <span className="text-body3 text-indigo-400">({member.studentNumber})</span>
                    </div>
                    <div className="text-cap1 text-indigo-300">{member.position}</div>
                  </div>
                </div>
                {!PROTECTED_POSITIONS.has(position) && (
                  <button
                    type="button"
                    onClick={() => handleMemberAction(member)}
                    disabled={isPending}
                    className="text-indigo-400 hover:bg-indigo-5 rounded-full p-2 disabled:opacity-50"
                  >
                    ⋯
                  </button>
                )}
              </Card>
            ))}
          </div>
        ))}
      </div>

      {/* Member Action Modal */}
      <BottomModal isOpen={isActionOpen} onClose={closeAction}>
        <div className="flex flex-col gap-2 p-5">
          <div className="text-body2 text-indigo-700 pb-2 font-semibold">
            {selectedMember?.name} 관리
          </div>
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
          <div className="text-body2 text-indigo-700 font-semibold">회장 위임</div>
          <div className="text-cap1 text-indigo-400">새 회장을 선택해주세요.</div>
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            {nonPresidentMembers.map((member) => {
              const isSelected = transferTarget === member.studentNumber;
              return (
                <button
                  key={member.studentNumber}
                  type="button"
                  onClick={() => setTransferTarget(member.studentNumber)}
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
          <div className="text-body2 text-indigo-700 font-semibold">부회장 변경</div>
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
              const isSelected = vpTarget === member.studentNumber;
              return (
                <button
                  key={member.studentNumber}
                  type="button"
                  onClick={() => setVPTarget(member.studentNumber)}
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
          <div className="text-body2 text-indigo-700 font-semibold">
            {selectedMember?.name} 직책 변경
          </div>
          <div className="flex max-h-60 flex-col gap-1 overflow-auto">
            {positions
              .filter((p) => p.positionGroup === 'MANAGER' || p.positionGroup === 'MEMBER')
              .map((position) => {
                const isSelected = selectedPositionId === position.positionId;
                return (
                  <button
                    key={position.positionId}
                    type="button"
                    onClick={() => setSelectedPositionId(position.positionId)}
                    className={`flex items-center justify-between rounded-lg p-2 ${
                      isSelected ? 'bg-indigo-5' : 'active:bg-indigo-5'
                    }`}
                  >
                    <div className={`text-body3 ${isSelected ? 'text-indigo-700' : 'text-indigo-400'}`}>
                      {position.name}
                    </div>
                    {isSelected && <CheckIcon className="h-4 w-4 text-blue-500" />}
                  </button>
                );
              })}
          </div>
          <button
            type="button"
            onClick={handleChangePosition}
            disabled={selectedPositionId === null || isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isChangingPosition ? '변경 중...' : '확인'}
          </button>
        </div>
      </BottomModal>

      {/* Remove Member Confirm Modal */}
      <BottomModal isOpen={isRemoveOpen} onClose={closeRemove}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 text-indigo-700 font-semibold">부원 추방</div>
          <div className="text-body3 text-indigo-400">
            정말 {selectedMember?.name}님을 추방하시겠어요?
          </div>
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
          <div className="text-body2 text-indigo-700 font-semibold">부원 추가</div>
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
            <label className="text-cap1 text-indigo-400">직책</label>
            <div className="flex items-center gap-2">
              <Dropdown
                options={positionOptions}
                value={newPositionId !== null ? String(newPositionId) : ''}
                onChange={(val) => setNewPositionId(Number(val))}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddMember}
            disabled={!newStudentNumber || newPositionId === null || isPending}
            className="bg-primary w-full rounded-lg py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isAdding ? '추가 중...' : '추가'}
          </button>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedMemberList;
