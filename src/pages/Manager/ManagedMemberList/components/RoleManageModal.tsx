import type { ClubMember } from '@/apis/club/entity';
import CheckIcon from '@/assets/svg/check-icon.svg';
import BottomModal from '@/components/common/BottomModal';

import { MemberAvatar } from './MemberCard';
import RoleManageSelector, { type RoleManageOption } from './RoleManageSelector';

interface RoleManageModalProps {
  isPending: boolean;
  isOpen: boolean;
  members: ClubMember[];
  onChangeTarget: (target: RoleManageOption) => void;
  onClose: () => void;
  onMemberClick: (userId: number) => void;
  onSubmit: () => void;
  roleManageTarget: RoleManageOption;
  selectedUserIds: Set<number>;
}

export default function RoleManageModal({
  isPending,
  isOpen,
  members,
  onChangeTarget,
  onClose,
  onMemberClick,
  onSubmit,
  roleManageTarget,
  selectedUserIds,
}: RoleManageModalProps) {
  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      className="h-165 max-h-[calc(var(--viewport-height)-184px)] rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
      overlayClassName="bg-black/50"
    >
      <div className="flex h-full flex-col">
        <div className="border-indigo-25 border-b px-6.75 py-4.5">
          <h2 className="text-text-700 leading-[1.6] font-semibold">직책 변경</h2>
        </div>

        <div className="px-5 pt-4.5">
          <RoleManageSelector value={roleManageTarget} onChange={onChangeTarget} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-6 pt-8.5">
          <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-auto">
            {members.map((member) => {
              const isSelected = selectedUserIds.has(member.userId);

              return (
                <button
                  key={member.userId}
                  type="button"
                  onClick={() => onMemberClick(member.userId)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <MemberAvatar name={member.name} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] leading-[1.6] font-semibold text-indigo-700">
                      {member.name} ({member.studentNumber})
                    </div>
                  </div>
                  {isSelected && <CheckIcon />}
                </button>
              );
            })}
          </div>

          <div className="px-4.5 pt-6 pb-5">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isPending}
              className="text-h2 bg-primary-500 h-12 w-full rounded-2xl text-white disabled:opacity-50"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </BottomModal>
  );
}
