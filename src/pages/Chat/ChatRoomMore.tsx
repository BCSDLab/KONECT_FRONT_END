import { useNavigate, useParams } from 'react-router-dom';
import { useToastContext } from '@/contexts/useToastContext';
import useChat from '@/pages/Chat/hooks/useChat';
import { useAuthStore } from '@/stores/authStore';

export default function ChatRoomMore() {
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const user = useAuthStore((s) => s.user);

  const { chatRoomList, clubMembers, deleteChatRoom, isDeletingChatRoom, kickMember, isKickingMember } =
    useChat(numericRoomId);

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);
  const isClubGroup = chatRoom?.chatType === 'CLUB_GROUP';
  const isLeaving = isDeletingChatRoom || isKickingMember;

  const handleLeaveChatRoom = async () => {
    if (!chatRoom) return;

    if (chatRoom.chatType === 'DIRECT') {
      await deleteChatRoom(numericRoomId);
      navigate('/chats', { replace: true });
      return;
    }

    if (chatRoom.chatType === 'GROUP') {
      const currentUserId = clubMembers.find((m) => m.studentNumber === user?.studentNumber)?.userId;
      if (!currentUserId) {
        showToast('사용자 정보를 찾을 수 없습니다.', 'error');
        return;
      }
      await kickMember({ chatRoomId: numericRoomId, targetUserId: currentUserId });
      navigate('/chats', { replace: true });
    }
  };

  return (
    <div className="bg-text-100 flex min-h-full flex-col items-center px-4 py-6">
      <div className="w-89.5 rounded-2xl bg-white">
        <p className="text-sub2 px-4 py-3 text-gray-500">친구 ({clubMembers.length})</p>
        <ul>
          {clubMembers.map((member) => (
            <li key={member.userId} className="flex items-center gap-3 px-4 py-2">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="text-sub2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                  {member.name[0]}
                </div>
              )}
              <span className="text-body1 text-gray-800">
                {member.name} ({member.studentNumber})
              </span>
            </li>
          ))}
        </ul>
      </div>
      {!isClubGroup && (
        <button
          type="button"
          disabled={isLeaving}
          onClick={() => void handleLeaveChatRoom()}
          className="mt-6 mb-[25px] flex h-13.25 w-89.5 shrink-0 items-center justify-center rounded-3xl bg-white text-[#FF4E4E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          채팅방 나가기
        </button>
      )}
    </div>
  );
}
