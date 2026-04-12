import type { Ref } from 'react';
import { useParams } from 'react-router-dom';
import useChat from '@/pages/Chat/hooks/useChat';
import BackTitleHeader from './BackTitleHeader';

export default function ChatRoomMoreHeader({ headerRef }: { headerRef?: Ref<HTMLElement> }) {
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);

  const { chatRoomList, toggleMute, isTogglingMute } = useChat(numericRoomId);
  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);
  const isMuted = chatRoom?.isMuted ?? false;

  const muteToggle = (
    <div className="flex items-center">
      <span className="text-#5A6B7F px-1">{isMuted == true ? '알림 켜기' : '알림 끄기'}</span>
      <button
        type="button"
        disabled={isTogglingMute}
        onClick={() => void toggleMute(numericRoomId)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          isMuted ? 'bg-primary-500' : 'bg-gray-300'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isMuted ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <BackTitleHeader
      title="더보기"
      headerRef={headerRef}
      rightSlot={muteToggle}
      headerClassName="h-13 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]"
    />
  );
}
