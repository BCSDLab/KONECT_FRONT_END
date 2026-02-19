import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import HamburgerIcon from '@/assets/svg/hamburger.svg';
import useChat from '@/pages/Chat/hooks/useChat';
import { useSmartBack } from '@/utils/hooks/useSmartBack';

function ChatHeader() {
  const smartBack = useSmartBack();
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);

  const { chatRoomList, clubMembers, toggleMute } = useChat(numericRoomId);

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);

  const [open, setOpen] = useState(false);

  const isGroup = chatRoom?.chatType === 'GROUP';

  const isMuted = chatRoom?.isMuted ?? false;

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-30 flex h-11 items-center justify-center bg-white px-4 py-2">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={smartBack}
          className="absolute top-1/2 left-4 -translate-y-1/2"
        >
          <ChevronLeftIcon />
        </button>

        <span className="text-lg">{chatRoom?.roomName ?? ''}</span>

        <button type="button" onClick={() => setOpen(true)} className="absolute top-1/2 right-4 -translate-y-1/2">
          <HamburgerIcon />
        </button>
      </header>

      <div
        className={`fixed inset-0 z-50 transition-colors duration-300 ${
          open ? 'pointer-events-auto bg-black/30' : 'pointer-events-none bg-black/0'
        }`}
        onClick={() => setOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-72 transform bg-white p-4 transition-transform duration-300 ease-in-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <span className="text-sm font-medium">알림</span>

            <button
              onClick={() => toggleMute()}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isMuted ? 'bg-gray-300' : 'bg-primary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMuted ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
          </div>

          {isGroup && (
            <>
              <div className="mb-4 text-sm font-bold">참여자 {clubMembers.length}명</div>
              <div className="flex flex-col gap-3">
                {clubMembers.map((member) => (
                  <div key={member.userId} className="flex items-center gap-3">
                    <img src={member.imageUrl} className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{member.name}</span>
                      <span className="text-xs text-gray-400">{member.studentNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatHeader;
