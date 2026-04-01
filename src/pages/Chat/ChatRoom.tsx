import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ChatMessage } from '@/apis/chat/entity';
import SendArrowIcon from '@/assets/svg/chat-send-arrow.svg';
import LinkifiedText from '@/components/common/LinkifiedText';
import useViewportHeightLock from '@/utils/hooks/useViewportHeightLock';
import { cn } from '@/utils/ts/cn';
import useChat from './hooks/useChat';
import useChatRoomScroll from './hooks/useChatRoomScroll';

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

interface ChatMessageRowProps {
  isSameSender: boolean;
  message: ChatMessage;
}

function ChatMessageRow({ isSameSender, message }: ChatMessageRowProps) {
  const showSenderName = !message.isMine && !isSameSender;
  const formattedTime = formatTime(message.createdAt);
  const formattedUnreadCount = message.unreadCount > 0 ? String(message.unreadCount) : null;

  if (message.isMine) {
    return (
      <div className="px-6 py-2">
        <div className="flex w-full min-w-0 items-end justify-end gap-2">
          {formattedUnreadCount && (
            <span className="text-primary-500 shrink-0 text-[10px] leading-[1.6] font-medium">
              {formattedUnreadCount}
            </span>
          )}
          <span className="shrink-0 text-[10px] leading-[1.6] font-medium text-indigo-100">{formattedTime}</span>

          <div className="bg-primary-500 text-sub4 max-w-[78%] min-w-0 rounded-2xl px-3 py-2 text-white shadow-[0_0_3px_rgba(0,0,0,0.15)]">
            <LinkifiedText
              text={message.content}
              className="wrap-anywhere whitespace-pre-wrap"
              linkClassName="text-white underline"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-2">
      <div className="flex items-end gap-2">
        <div className="flex max-w-[78%] min-w-0 flex-col items-start gap-1">
          {showSenderName && (
            <div className="text-text-500 text-[10px] leading-[1.6] font-bold">{message.senderName}</div>
          )}

          <div className="bg-indigo-5 text-sub4 max-w-full rounded-2xl px-3 py-2 text-black">
            <LinkifiedText
              text={message.content}
              className="wrap-anywhere whitespace-pre-wrap"
              linkClassName="text-primary-500 underline"
            />
          </div>
        </div>

        <span className="shrink-0 text-[10px] leading-[1.6] font-medium text-indigo-100">{formattedTime}</span>
      </div>
    </div>
  );
}

function ChatRoom() {
  const { chatRoomId } = useParams();
  const { sendMessage, chatMessages, fetchNextPage, hasNextPage, isFetchingNextPage, isSendingMessage } = useChat(
    Number(chatRoomId)
  );
  const [value, setValue] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const baseTextareaHeightRef = useRef(0);
  const { scrollContainerRef, topRef, scrollToBottom } = useChatRoomScroll({
    chatRoomId,
    chatMessagesLength: chatMessages.length,
    latestMessageId: chatMessages[0]?.messageId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  useViewportHeightLock(scrollContainerRef);

  const sortedMessages = [...chatMessages].reverse();
  const isSubmitDisabled = isSendingMessage || !value.trim();

  const resetTextareaHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = 'auto';
    const baseHeight = baseTextareaHeightRef.current || textareaRef.current.scrollHeight;
    baseTextareaHeightRef.current = baseHeight;
    textareaRef.current.style.height = `${baseHeight}px`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = value.trim();
    if (!message) return;

    sendMessage({
      chatRoomId: Number(chatRoomId),
      content: message,
    });

    setValue('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    scrollToBottom();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    const nextHeight = e.target.scrollHeight;

    if (!baseTextareaHeightRef.current) {
      baseTextareaHeightRef.current = nextHeight;
    }

    e.target.style.height = `${nextHeight}px`;
  };

  useEffect(() => {
    resetTextareaHeight();
  }, []);

  useEffect(() => {
    if (!value) {
      resetTextareaHeight();
    }
  }, [value]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
        <div ref={topRef} />

        {sortedMessages.map((message, index) => {
          const currentDate = getDateKey(message.createdAt);
          const prevDate = index > 0 ? getDateKey(sortedMessages[index - 1].createdAt) : null;
          const showDateHeader = currentDate !== prevDate;

          const prevMessage = index > 0 ? sortedMessages[index - 1] : null;

          const isSameSender = prevMessage?.senderId === message.senderId && !showDateHeader;

          return (
            <div key={message.messageId} className="w-full min-w-0">
              {showDateHeader && (
                <div className={cn('flex justify-center px-6', index === 0 ? 'pb-2' : 'pt-4 pb-2')}>
                  <span className="text-text-400 text-sub4 rounded-2xl bg-white px-3 py-1">
                    {formatDate(message.createdAt)}
                  </span>
                </div>
              )}

              <ChatMessageRow isSameSender={isSameSender} message={message} />
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="shrink-0 bg-white px-5 pt-3 pb-[calc(12px+var(--effective-bottom-safe-area))]"
      >
        <div className="bg-text-100 flex min-w-0 items-end gap-3 rounded-[30px] px-4 py-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            aria-label="메시지 입력"
            className="text-text-600 text-sub4 placeholder:text-text-300 max-h-32 min-h-6 min-w-0 flex-1 resize-none overflow-x-hidden bg-transparent py-1 wrap-anywhere whitespace-pre-wrap outline-none"
            rows={1}
            maxLength={1000}
          />

          <button
            type="submit"
            aria-label="메시지 전송"
            disabled={isSubmitDisabled}
            className="text-text-600 disabled:text-text-300 flex size-6 shrink-0 items-center justify-center"
          >
            <SendArrowIcon className="size-6" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatRoom;
