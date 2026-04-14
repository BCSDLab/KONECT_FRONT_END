import type { PositionType } from '@/apis/club/entity';
import ManagerInfoCard from '@/pages/User/MyPage/components/ManagerInfoCard';
import ActionPopupMenu, { type PopupMenuItem } from './components/ActionPopupMenu';
import AddMemberModal from './components/AddMemberModal';
import DeletePreMemberModal from './components/DeletePreMemberModal';
import MemberCard from './components/MemberCard';
import MemberSection from './components/MemberSection';
import MemberSheetImportLoadingOverlay from './components/MemberSheetImportLoadingOverlay';
import MemberSheetImportModal from './components/MemberSheetImportModal';
import RemoveMemberModal from './components/RemoveMemberModal';
import RoleManageModal from './components/RoleManageModal';
import useManagedMemberList from './hooks/useManagedMemberList';

const POSITION_LABELS: Record<PositionType, string> = {
  PRESIDENT: '회장',
  VICE_PRESIDENT: '부회장',
  MANAGER: '운영진',
  MEMBER: '부원',
};

function ManagedMemberList() {
  const {
    total,
    protectedMembers,
    managerMembers,
    generalMembers,
    preMembers,
    isPending,
    roleManage,
    addMember,
    memberAction,
    memberSheetImport,
    preMemberAction,
    handleCreateChatRoom,
  } = useManagedMemberList();

  const memberActions = [
    { label: '직책 변경', onClick: roleManage.handleOpen },
    { label: '부원 추가', onClick: addMember.open },
    { label: '인명부 불러오기', onClick: memberSheetImport.open },
  ];

  const memberMenuItems: PopupMenuItem[] = [
    { label: '지원서 보기', onClick: memberAction.handleOpenApplication },
    { label: '채팅하기', onClick: handleCreateChatRoom },
    { label: '부원 삭제', onClick: memberAction.handleOpenRemove, tone: 'danger' },
  ];

  const preMemberMenuItems: PopupMenuItem[] = [
    { label: '사전 등록 삭제', onClick: preMemberAction.handleOpenDelete, tone: 'danger' },
  ];

  return (
    <div className="flex flex-col gap-9 px-4.75 py-4.25">
      <ManagerInfoCard type="detail" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="border-indigo-5 flex items-center justify-center rounded-2xl border bg-white px-3 py-3">
            <span className="text-text-600 text-[15px] leading-6 font-semibold">총 부원수 : {total}명</span>
          </div>

          <div className="flex gap-2">
            {memberActions.map(({ label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={isPending}
                className="bg-primary-500 flex-auto rounded-full px-4 py-1.5 text-[15px] leading-6 font-semibold text-white disabled:opacity-50"
              >
                {label}
              </button>
            ))}
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
                  onAction={(event) => memberAction.handleOpenAction(member, event)}
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
                  onAction={(event) => memberAction.handleOpenAction(member, event)}
                  positionLabel={POSITION_LABELS[member.position]}
                  showAction
                  studentNumber={member.studentNumber}
                />
              ))}
            </MemberSection>
          )}

          {preMembers.length > 0 && (
            <MemberSection title="사전 등록 회원">
              {preMembers.map((member) => (
                <MemberCard
                  key={member.preMemberId}
                  disabled={isPending}
                  name={member.name}
                  onAction={(event) => preMemberAction.handleOpenAction(member, event)}
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
        anchor={memberAction.actionMenuAnchor}
        isOpen={memberAction.isActionOpen}
        onClose={memberAction.handleCloseAction}
        items={memberMenuItems}
      />

      <ActionPopupMenu
        anchor={preMemberAction.actionMenuAnchor}
        isOpen={preMemberAction.isActionOpen}
        onClose={preMemberAction.handleCloseAction}
        items={preMemberMenuItems}
      />

      <RoleManageModal
        isPending={isPending}
        isOpen={roleManage.isOpen}
        members={roleManage.roleManageMembers}
        onChangeTarget={roleManage.handleChangeTarget}
        onClose={roleManage.close}
        onMemberClick={roleManage.handleMemberClick}
        onSubmit={() => void roleManage.handleSubmit()}
        roleManageTarget={roleManage.target}
        selectedUserIds={roleManage.selectedUserIds}
      />

      <RemoveMemberModal
        isPending={isPending}
        isOpen={memberAction.isRemoveOpen}
        isRemoving={memberAction.isRemoving}
        memberName={memberAction.selectedMember?.name}
        onClose={memberAction.closeRemove}
        onConfirm={memberAction.handleRemove}
      />

      <AddMemberModal
        isAdding={addMember.isAdding}
        isPending={isPending}
        isOpen={addMember.isOpen}
        name={addMember.name}
        onChangeName={addMember.setName}
        onChangeStudentNumber={addMember.setStudentNumber}
        onClose={addMember.close}
        onSubmit={addMember.handleSubmit}
        studentNumber={addMember.studentNumber}
      />

      <DeletePreMemberModal
        isDeletingPreMember={preMemberAction.isDeletingPreMember}
        isPending={isPending}
        isOpen={preMemberAction.isDeleteOpen}
        memberName={preMemberAction.selectedPreMember?.name}
        onClose={preMemberAction.closeDelete}
        onConfirm={preMemberAction.handleDelete}
      />

      <MemberSheetImportModal
        errorMessage={memberSheetImport.errorMessage}
        isOpen={memberSheetImport.isOpen}
        isSubmitting={memberSheetImport.isSubmitting}
        onChangeUrl={memberSheetImport.handleChangeUrl}
        onClose={memberSheetImport.close}
        onSubmit={memberSheetImport.handleSubmit}
        spreadsheetUrl={memberSheetImport.spreadsheetUrl}
      />

      <MemberSheetImportLoadingOverlay isOpen={memberSheetImport.isSubmitting} />
    </div>
  );
}

export default ManagedMemberList;
