import { useRef, useEffect, type ChangeEvent } from 'react';
import clsx from 'clsx';
import { useParams } from 'react-router-dom';
import PaperPlaneIcon from '@/assets/svg/paper-plane.svg';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import useKeyboardHeight from '@/utils/hooks/useKeyboardHeight';
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
  const { sendMessage, chatMessages, fetchNextPage, hasNextPage, isFetchingNextPage } = useChat(Number(chatRoomId));
  useKeyboardHeight();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const topRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, { threshold: 0.1 });

  const sortedMessages = [...chatMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    // textarea가 늘어나면 스크롤을 맨 아래로
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (textareaRef.current) {
      const message = textareaRef.current.value.trim();
      if (message) {
        sendMessage({ chatRoomId: Number(chatRoomId), content: message });
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chatMessages]);

  return (
    <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div ref={topRef} />

        {sortedMessages.map((message, index) => {
          const currentDate = getDateKey(message.createdAt);
          const prevDate = index > 0 ? getDateKey(sortedMessages[index - 1].createdAt) : null;
          const showDateHeader = currentDate !== prevDate;

          const prevMessage = index > 0 ? sortedMessages[index - 1] : null;
          const isSameSender = prevMessage?.isMine === message.isMine && !showDateHeader;

          return (
            <div key={message.messageId}>
              {showDateHeader && (
                <div className="flex justify-center px-6 py-3">
                  <span className="bg-indigo-25 text-primary rounded-full px-3 py-1 text-xs leading-[160%] font-medium">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              )}

              <div
                className={clsx(
                  'flex items-end gap-2 px-6 pb-2',
                  isSameSender ? 'pt-0' : 'pt-2',
                  message.isMine ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={clsx(
                    'max-w-[70%] rounded-lg px-3 py-2 text-sm leading-[160%] wrap-break-word',
                    message.isMine ? 'bg-[#f5f5f5]' : 'bg-[#f1f8ff]'
                  )}
                >
                  {message.content}
                </div>
                <div className="flex flex-col items-end">
                  {message.isMine && !message.isRead && <span className="text-primary text-xs">1</span>}
                  <span className="text-xs text-indigo-100">{formatTime(message.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="bg-indigo-25 flex shrink-0 items-end gap-2 px-5 py-2">
        <textarea
          ref={textareaRef}
          onChange={handleChange}
          className="bg-indigo-0 max-h-32 w-full resize-none rounded-sm px-3 py-2 text-sm leading-4 text-indigo-700 placeholder:text-indigo-500"
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
