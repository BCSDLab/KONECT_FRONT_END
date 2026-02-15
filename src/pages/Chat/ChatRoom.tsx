import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import PaperPlaneIcon from '@/assets/svg/paper-plane.svg';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import useKeyboardHeight from '@/utils/hooks/useViewportHeight';
import useChat from './hooks/useChat';

const getDateKey = (dateString: string) => {
  return dateString.split(' ')[0];
};

const formatDate = (dateString: string) => {
  const datePart = dateString.split(' ')[0];
  const [year, month, day] = datePart.split('.');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
};

const formatTime = (dateString: string) => {
  const timePart = dateString.split(' ')[1];
  const [hour, minute] = timePart.split(':');
  return `${hour}:${minute}`;
};

function ChatRoom() {
  const { chatRoomId } = useParams();
  const { sendMessage, chatMessages, fetchNextPage, hasNextPage, isFetchingNextPage, chatRoomList } = useChat(
    Number(chatRoomId)
  );

  useKeyboardHeight();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, { threshold: 0.1 });

  const currentRoom = chatRoomList.rooms.find((room) => room.roomId === Number(chatRoomId));

  const isGroup = currentRoom?.chatType === 'GROUP';

  const sortedMessages = [...chatMessages].reverse();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!textareaRef.current) return;

    const message = textareaRef.current.value.trim();
    if (!message) return;

    sendMessage({
      chatRoomId: Number(chatRoomId),
      content: message,
    });

    textareaRef.current.value = '';
    textareaRef.current.style.height = 'auto';
    textareaRef.current.focus();
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chatMessages]);

  return (
    <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col">
      <div className="bg-indigo-0 min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div ref={topRef} />

        {sortedMessages.map((message, index) => {
          const currentDate = getDateKey(message.createdAt);
          const prevDate = index > 0 ? getDateKey(sortedMessages[index - 1].createdAt) : null;
          const showDateHeader = currentDate !== prevDate;

          const prevMessage = index > 0 ? sortedMessages[index - 1] : null;

          const isSameSender = prevMessage?.senderId === message.senderId && !showDateHeader;

          return (
            <div
              key={message.messageId}
              className={clsx('w-full px-6', showDateHeader ? 'mt-4' : isSameSender ? 'mt-1' : 'mt-3')}
            >
              {showDateHeader && (
                <div className="flex justify-center py-3">
                  <span className="bg-indigo-25 text-primary rounded-full px-3 py-1 text-xs">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              )}

              <div className={clsx('flex w-full items-end', message.isMine ? 'justify-end' : 'justify-start')}>
                {!message.isMine && (
                  <div className="flex max-w-[80%] items-end gap-2">
                    {isGroup && (
                      <div className="w-8 shrink-0">
                        {!isSameSender ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs">
                            {message.senderName?.[0]}
                          </div>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    <div className="flex flex-col">
                      {isGroup && !isSameSender && (
                        <div className="mb-1 text-xs text-indigo-400">{message.senderName}</div>
                      )}

                      <div className="rounded-lg bg-[#f1f8ff] px-3 py-2 text-sm wrap-break-word">{message.content}</div>
                    </div>

                    <span className="mb-1 self-end text-xs text-indigo-300">{formatTime(message.createdAt)}</span>
                  </div>
                )}

                {/* ===== RIGHT (내 메시지) ===== */}
                {message.isMine && (
                  <div className="flex max-w-[80%] flex-row-reverse items-end gap-2">
                    <div className="rounded-lg bg-[#f5f5f5] px-3 py-2 text-sm wrap-break-word">{message.content}</div>

                    <span className="mb-1 self-end text-xs text-indigo-300">{formatTime(message.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="bg-indigo-25 flex shrink-0 items-end gap-2 px-5 py-2">
        <textarea
          ref={textareaRef}
          className="bg-indigo-0 max-h-32 w-full resize-none rounded-sm px-3 py-2 text-sm text-indigo-700 placeholder:text-indigo-500"
          rows={1}
          placeholder="메세지 보내기"
        />
        <button type="submit" className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-sm">
          <PaperPlaneIcon className="text-indigo-0" />
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;
