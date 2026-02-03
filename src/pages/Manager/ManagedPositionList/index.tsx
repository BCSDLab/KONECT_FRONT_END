import { useState } from 'react';
import { useParams } from 'react-router-dom';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import Dropdown from '@/components/common/Dropdown';
import UserInfoCard from '@/pages/User/MyPage/components/UserInfoCard';
import type { Position, PositionGroup } from '@/apis/club/entity';
import useBooleanState from '@/utils/hooks/useBooleanState';
import {
  useClubPositions,
  useCreatePosition,
  useDeletePosition,
  useRenamePosition,
} from '../hooks/useManagerQuery';

const POSITION_GROUP_LABELS: Record<PositionGroup, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '운영진',
  MEMBER: '일반 회원',
};

const EDITABLE_GROUPS: PositionGroup[] = ['MANAGER', 'MEMBER'];
const ALL_GROUPS: PositionGroup[] = ['PRESIDENT', 'VICE_PRESIDENT', 'MANAGER', 'MEMBER'];

const positionGroupOptions = [
  { value: 'MANAGER' as const, label: '운영진' },
  { value: 'MEMBER' as const, label: '일반 회원' },
] as const;

function ManagedPositionList() {
  const params = useParams();
  const clubId = Number(params.clubId);

  const { clubPositions } = useClubPositions(clubId);
  const { mutate: createPosition, isPending: isCreating } = useCreatePosition(clubId);
  const { mutate: deletePositionMutate, isPending: isDeleting } = useDeletePosition(clubId);
  const { mutate: renamePosition, isPending: isRenaming } = useRenamePosition(clubId);

  const isPending = isCreating || isDeleting || isRenaming;

  // Add form state
  const { value: isAddFormOpen, setTrue: showAddForm, setFalse: hideAddForm } = useBooleanState();
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<'MANAGER' | 'MEMBER'>('MEMBER');

  // Inline rename state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  // Delete confirm state
  const { value: isDeleteOpen, setTrue: openDelete, setFalse: closeDelete } = useBooleanState();
  const [deleteTarget, setDeleteTarget] = useState<Position | null>(null);

  const positionsByGroup = new Map<PositionGroup, Position[]>();
  for (const group of ALL_GROUPS) {
    positionsByGroup.set(group, []);
  }
  for (const position of clubPositions.positions) {
    positionsByGroup.get(position.positionGroup)?.push(position);
  }

  const handleCreate = () => {
    if (!newName.trim()) return;
    createPosition({ name: newName.trim(), positionGroup: newGroup });
    setNewName('');
    hideAddForm();
  };

  const handleStartRename = (position: Position) => {
    setEditingId(position.positionId);
    setEditingName(position.name);
  };

  const handleRename = (positionId: number) => {
    if (!editingName.trim()) return;
    renamePosition({ positionId, data: { name: editingName.trim() } });
    setEditingId(null);
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleOpenDelete = (position: Position) => {
    setDeleteTarget(position);
    openDelete();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deletePositionMutate(deleteTarget.positionId);
    closeDelete();
    setDeleteTarget(null);
  };

  const isEditable = (group: PositionGroup) => EDITABLE_GROUPS.includes(group);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-3">
        <UserInfoCard type="detail" />

        <button
          type="button"
          onClick={showAddForm}
          disabled={isPending || isAddFormOpen}
          className="bg-primary w-full rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          + 직책 추가
        </button>

        {isAddFormOpen && (
          <Card className="gap-2">
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="직책 이름을 입력해주세요"
                className="border-indigo-25 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2">
                <span className="text-cap1 text-indigo-400">그룹:</span>
                <Dropdown
                  options={positionGroupOptions}
                  value={newGroup}
                  onChange={(val) => setNewGroup(val as 'MANAGER' | 'MEMBER')}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={hideAddForm}
                className="border-indigo-25 flex-1 rounded-lg border py-2 text-sm font-medium"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || isPending}
                className="bg-primary flex-1 rounded-lg py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {isCreating ? '추가 중...' : '추가'}
              </button>
            </div>
          </Card>
        )}

        {ALL_GROUPS.map((group) => {
          const positions = positionsByGroup.get(group) ?? [];
          if (positions.length === 0) return null;

          return (
            <div key={group} className="flex flex-col gap-1">
              <div className="text-body2 text-indigo-700 px-1 py-1 font-semibold">
                {POSITION_GROUP_LABELS[group]}
              </div>
              {positions.map((position) => (
                <Card key={position.positionId} className="flex-row items-center gap-2">
                  <div className="flex flex-1 items-center gap-2">
                    {editingId === position.positionId ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(position.positionId);
                          if (e.key === 'Escape') handleCancelRename();
                        }}
                        className="border-indigo-25 flex-1 rounded-lg border px-2 py-1 text-sm outline-none focus:border-blue-500"
                        autoFocus
                      />
                    ) : (
                      <div>
                        <div className="text-body2 text-indigo-700">{position.name}</div>
                        <div className="text-cap1 text-indigo-300">{position.memberCount}명</div>
                      </div>
                    )}
                  </div>
                  {isEditable(group) && (
                    <div className="flex items-center gap-1">
                      {editingId === position.positionId ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRename(position.positionId)}
                            disabled={isPending}
                            className="text-cap1 rounded-lg bg-blue-500 px-2 py-1 text-white disabled:opacity-50"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelRename}
                            className="text-cap1 border-indigo-25 rounded-lg border px-2 py-1"
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartRename(position)}
                            disabled={isPending}
                            className="text-cap1 text-indigo-400 hover:bg-indigo-5 rounded-lg px-2 py-1 disabled:opacity-50"
                          >
                            이름변경
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(position)}
                            disabled={isPending}
                            className="text-cap1 hover:bg-indigo-5 rounded-lg px-2 py-1 text-red-500 disabled:opacity-50"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      {/* Delete Position Confirm Modal */}
      <BottomModal isOpen={isDeleteOpen} onClose={closeDelete}>
        <div className="flex flex-col gap-3 p-5">
          <div className="text-body2 text-indigo-700 font-semibold">직책 삭제</div>
          <div className="text-body3 text-indigo-400">
            정말 &apos;{deleteTarget?.name}&apos; 직책을 삭제하시겠어요?
            {deleteTarget && deleteTarget.memberCount > 0 && (
              <span className="text-red-500"> (현재 {deleteTarget.memberCount}명이 이 직책에 속해있습니다)</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeDelete}
              className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 rounded-lg bg-red-500 py-3 text-center font-bold text-white disabled:opacity-50"
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedPositionList;
