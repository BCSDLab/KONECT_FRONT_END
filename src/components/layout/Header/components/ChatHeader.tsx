import { useParams } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import HamburgerIcon from '@/assets/svg/hamburger.svg';
import useChat from '@/pages/Chat/hooks/useChat';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useSmartBack } from '@/utils/hooks/useSmartBack';
import { cn } from '@/utils/ts/cn';

function ChatHeader() {
  const smartBack = useSmartBack();
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);

  const { chatRoomList, clubMembers, toggleMute, isTogglingMute } = useChat(numericRoomId);

  const { value: open, setTrue: openSidebar, setFalse: closeSidebar } = useBooleanState();

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);
  const isGroup = chatRoom?.chatType === 'GROUP';
  const isMuted = chatRoom?.isMuted ?? false;

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-30 flex h-13 items-center bg-white px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button type="button" aria-label="뒤로가기" onClick={smartBack} className="shrink-0">
            <ChevronLeftIcon />
          </button>

          <div className="flex min-w-0 items-center gap-1">
            <span className="truncate leading-5 font-bold text-indigo-700">{chatRoom?.roomName ?? ''}</span>
            {isGroup && <span className="text-text-700 text-[13px] leading-5">{clubMembers.length}</span>}
          </div>
        </div>

        <button type="button" aria-label="채팅방 정보 열기" onClick={openSidebar} className="shrink-0">
          <HamburgerIcon />
        </button>
      </header>

      <div
        className={cn('fixed inset-0 z-50 transition-colors duration-300', {
          'pointer-events-auto bg-black/30': open,
          'pointer-events-none bg-black/0': !open,
        })}
        onClick={closeSidebar}
      >
        <div
          className={cn(
            'absolute top-0 right-0 flex h-full w-72 transform flex-col overflow-hidden bg-white p-4 transition-transform duration-300 ease-in-out',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 flex shrink-0 items-center justify-between border-b pb-4">
            <span className="text-sm font-medium">알림</span>

            <button
              type="button"
              disabled={isTogglingMute}
              onClick={() => void toggleMute()}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isMuted ? 'bg-gray-300' : 'bg-primary'
              } disabled:cursor-not-allowed disabled:opacity-60`}
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
              <div className="mb-4 shrink-0 text-sm font-bold">참여자 {clubMembers.length}명</div>
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
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
