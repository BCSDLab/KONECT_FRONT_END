import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ClubMember } from '@/apis/club/entity';
import { MemberAvatar } from '@/components/common/MemberAvatar';
import Modal from '@/components/common/Modal';
import { useToastContext } from '@/contexts/useToastContext';
import useChat from '@/pages/Chat/hooks/useChat';
import { isDirectChatType, isGroupChatType } from '@/pages/Chat/utils/chatType';
import { useAuthStore } from '@/stores/authStore';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import { cn } from '@/utils/ts/cn';

interface MemberRowProps {
  member: ClubMember;
  isCurrentUser: boolean;
  isActive: boolean;
  canOpenActions: boolean;
  showKickAction: boolean;
  isCreatingChatRoom: boolean;
  onToggle: (userId: number) => void;
  onCreateDirectChat: (member: ClubMember) => void;
  onShowUnsupportedAction: () => void;
}

function MemberRow({
  member,
  isCurrentUser,
  isActive,
  canOpenActions,
  showKickAction,
  isCreatingChatRoom,
  onToggle,
  onCreateDirectChat,
  onShowUnsupportedAction,
}: MemberRowProps) {
  const actionWidthClassName = showKickAction ? 'w-34.25' : 'w-18.75';

  return (
    <div className="flex min-h-11.75 items-center">
      <button
        type="button"
        onClick={() => onToggle(member.userId)}
        disabled={!canOpenActions}
        className={cn(
          'flex min-h-11.75 min-w-0 flex-1 items-center gap-3 text-left transition-transform duration-200 ease-out disabled:cursor-default',
          {
            '-translate-x-3.75': isActive && canOpenActions,
          }
        )}
      >
        <MemberAvatar name={member.name} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[15px] leading-[1.6] font-semibold text-indigo-700">
            {member.name} ({member.studentNumber})
          </div>
        </div>
        {isCurrentUser && <span className="text-text-300 text-[12px] leading-[1.6] font-medium">나</span>}
      </button>

      {!isCurrentUser && (
        <div
          aria-hidden={!isActive}
          className={cn(
            'flex h-11.75 shrink-0 items-center overflow-hidden transition-[width,margin,opacity] duration-200 ease-out',
            actionWidthClassName,
            isActive && canOpenActions
              ? 'pointer-events-auto ml-4 opacity-100'
              : 'pointer-events-none ml-0 w-0 opacity-0'
          )}
        >
          {showKickAction && (
            <button
              type="button"
              onClick={onShowUnsupportedAction}
              tabIndex={isActive && canOpenActions ? 0 : -1}
              disabled={!isActive || !canOpenActions}
              className="flex h-full w-15.5 items-center justify-center bg-[#ff4e4e] px-1.75 text-center text-[12px] leading-[1.6] font-medium whitespace-nowrap text-white"
            >
              내보내기
            </button>
          )}
          <button
            type="button"
            onClick={() => onCreateDirectChat(member)}
            tabIndex={isActive && canOpenActions ? 0 : -1}
            disabled={!isActive || !canOpenActions || isCreatingChatRoom}
            className="bg-text-300 flex h-full w-18.75 items-center justify-center px-1.75 text-center text-[12px] leading-[1.6] font-medium whitespace-nowrap text-white disabled:opacity-60"
          >
            1:1 채팅하기
          </button>
        </div>
      )}
    </div>
  );
}

function ChatRoomInfo() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);

  const currentUser = useAuthStore((state) => state.user);
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();
  const { chatRoomList, clubMembers, createChatRoom, isCreatingChatRoom, deleteChatRoom, isDeletingChatRoom } =
    useChat(numericRoomId);
  const [activeMemberId, setActiveMemberId] = useState<number | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);
  const chatType = chatRoom?.chatType;
  const isGroupChat = isGroupChatType(chatRoom?.chatType);
  const isClubGroupChat = chatType === 'CLUB_GROUP';
  const isGeneralGroupChat = chatType === 'GROUP';
  const canLeaveRoom = isDirectChatType(chatType) || isGeneralGroupChat;
  const currentClubMember = currentUser
    ? clubMembers.find(
        (member) => member.name === currentUser.name && member.studentNumber === currentUser.studentNumber
      )
    : null;
  const isCurrentClubExecutive = Boolean(currentClubMember && currentClubMember.position !== 'MEMBER');
  const canManageMembers = isClubGroupChat ? isCurrentClubExecutive : false;

  const handleToggleMemberAction = (userId: number) => {
    setActiveMemberId((previous) => (previous === userId ? null : userId));
  };

  const handleAddMember = () => {
    showToast('인원 추가 기능은 준비 중입니다.', 'info');
  };

  const handleShowUnsupportedAction = () => {
    showToast('멤버 관리 기능은 아직 연결되지 않았습니다.', 'info');
  };

  const handleCreateDirectChat = async (member: ClubMember) => {
    try {
      const response = await createChatRoom(member.userId);
      navigate(`/chats/${response.chatRoomId}`);
    } catch (error) {
      showApiErrorToast(error, '1:1 채팅방 생성에 실패했습니다.');
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await deleteChatRoom(numericRoomId);
      navigate('/chats', { replace: true });
    } catch (error) {
      showApiErrorToast(error, '채팅방 나가기에 실패했습니다.');
    } finally {
      setIsLeaveModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-background flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-[calc(24px+var(--effective-bottom-safe-area))]">
          <div className="flex flex-col gap-4">
            <section className="rounded-2xl bg-white px-5 py-4 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]">
              <div className="flex flex-col gap-5">
                <div className="text-text-700 text-[15px] leading-5">
                  {isGroupChat ? `친구 (${clubMembers.length})` : '채팅방 정보'}
                </div>

                {isGroupChat && canManageMembers && (
                  <button type="button" onClick={handleAddMember} className="flex items-center gap-3 text-left">
                    <div className="bg-text-100 text-text-600 flex size-10 shrink-0 items-center justify-center rounded-[10px] text-[15px] leading-[1.6] font-medium">
                      +
                    </div>
                    <span className="text-primary-500 text-[15px] leading-[1.6] font-semibold">인원 추가하기</span>
                  </button>
                )}

                {clubMembers.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {clubMembers.map((member) => {
                      const isCurrentUser = currentUser
                        ? member.name === currentUser.name && member.studentNumber === currentUser.studentNumber
                        : false;
                      const canOpenActions = isGroupChat && !isCurrentUser;
                      const showKickAction = canManageMembers;

                      return (
                        <MemberRow
                          key={member.userId}
                          member={member}
                          isCurrentUser={isCurrentUser}
                          isActive={activeMemberId === member.userId}
                          canOpenActions={canOpenActions}
                          showKickAction={showKickAction}
                          isCreatingChatRoom={isCreatingChatRoom}
                          onToggle={handleToggleMemberAction}
                          onCreateDirectChat={handleCreateDirectChat}
                          onShowUnsupportedAction={handleShowUnsupportedAction}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-text-500 text-[14px] leading-[1.6]">
                    {isGroupChat ? '표시할 친구가 아직 없어요.' : '이 채팅방은 참여자 목록을 지원하지 않아요.'}
                  </p>
                )}
              </div>
            </section>

            {canLeaveRoom && (
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(true)}
                disabled={isDeletingChatRoom}
                className="rounded-2xl bg-white px-5 py-4 text-[16px] leading-[1.6] font-medium text-[#ff4e4e] shadow-[0_0_20px_0_rgba(0,0,0,0.03)] disabled:opacity-60"
              >
                채팅방 나가기
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isLeaveModalOpen && canLeaveRoom}
        onClose={() => setIsLeaveModalOpen(false)}
        className="rounded-2xl px-4 py-5"
      >
        <div className="text-text-700 flex flex-col gap-5 text-center text-[15px] leading-[1.6]">
          <p className="font-semibold">채팅방 나가기</p>
          <p className="font-medium">{chatRoom?.roomName ?? ''} 채팅방을 나가시겠어요?</p>
          <div className="flex gap-2 text-[15px] leading-5.5 font-bold">
            <button
              type="button"
              className="border-primary-500 text-primary-500 flex-1 rounded-[10px] border py-2.75"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              취소
            </button>
            <button
              type="button"
              className="bg-primary-500 border-primary-500 flex-1 rounded-[10px] border text-white disabled:opacity-60"
              onClick={() => void handleLeaveRoom()}
              disabled={isDeletingChatRoom}
            >
              나가기
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ChatRoomInfo;
