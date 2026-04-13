import { Fragment, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import type { User, Section, SortBy } from '@/apis/chat/entity';
import { chatQueries } from '@/apis/chat/queries';
import Search from '@/assets/svg/big-search-icon.svg';
import Check from '@/assets/svg/check_color.svg';
import Dropdown from '@/components/common/Dropdown';
import ChatAddHeader from '@/components/layout/Header/components/ChatAddHeader';
import { getHeaderPresentation } from '@/components/layout/Header/presentation';
import useChat from '@/pages/Chat/hooks/useChat';
import useDebouncedCallback from '@/utils/hooks/useDebounce';
import { isApiError } from '@/utils/ts/error/apiError';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/error/errorRedirect';

type UserListProps = {
  onToggle: (userId: number) => void;
  selectedUserIds: Set<number>;
};

function InvitableSectionList({ clubName, users, onToggle, selectedUserIds }: Section & UserListProps) {
  return (
    <div className="px-5 py-5">
      <span className="text-text-700 text-[14px]">{clubName}</span>
      {users.map((user) => (
        <Fragment key={user.userId}>
          <div className="flex py-4 pr-3" onClick={() => onToggle(user.userId)}>
            <div className="text-text-600 bg-text-100 flex size-10 shrink-0 items-center justify-center rounded-xl text-[15px]">
              {user.name[0]}
            </div>
            <span className="flex w-full items-center px-3 text-indigo-700">
              {user.name} ({user.studentNumber})
            </span>
            {selectedUserIds.has(user.userId) && <Check className="size-6.5 pt-2" />}
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function InvitableUserList({ userId, name, studentNumber, onToggle, selectedUserIds }: User & UserListProps) {
  return (
    <div className="px-5" onClick={() => onToggle(userId)}>
      <div className="flex py-4">
        <div className="text-text-600 bg-text-100 flex size-10 shrink-0 items-center justify-center rounded-xl text-[15px]">
          {name[0]}
        </div>
        <span className="flex w-full items-center px-3 text-indigo-700">
          {name} ({studentNumber})
        </span>
        {selectedUserIds.has(userId) && <Check className="size-6.5 pt-2" />}
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'CLUB', label: '동아리' },
  { value: 'NAME', label: '이름' },
] as const;

export default function AddChatRoom() {
  const { pathname } = useLocation();
  const { title } = getHeaderPresentation(pathname);
  const [keyword, setKeyword] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('CLUB');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const navigate = useNavigate();
  const { createRoomGroup } = useChat();
  const { data } = useSuspenseQuery({
    ...chatQueries.invite(debouncedQuery, sortBy),
  });

  const onConfirm = async () => {
    try {
      const result = await createRoomGroup(Array.from(selectedUserIds));
      navigate(`/chats/${result.chatRoomId}`);
    } catch (error) {
      if (isApiError(error) && isServerErrorStatus(error.status)) {
        redirectToServerErrorPage();
      }
    }
  };

  const updateDebouncedQuery = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    setDebouncedQuery(trimmed);
  }, 300);
  const handleChange = (value: string) => {
    setKeyword(value);
    updateDebouncedQuery(value);
  };
  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col items-center pt-19">
      <ChatAddHeader title={title} onConfirm={onConfirm} />
      <label className="flex h-13 w-87.5 items-center overflow-hidden rounded-full bg-white px-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          className="h-full flex-1 bg-white px-3"
          placeholder="이름, 학번 검색"
        />
        <Search />
      </label>
      <div className="mt-6 h-full w-87.5 overflow-y-auto rounded-t-2xl bg-white py-4">
        <div className="flex w-full px-5">
          <span className="text-#344352 flex-1 translate-y-2 text-[15px]">친구 선택({data?.currentCount})</span>
          <Dropdown
            className="h-7.25 w-19 text-[13px] font-medium"
            triggerClassName="w-full"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </div>
        {data?.sortBy === 'CLUB'
          ? data?.sections?.map((section) => (
              <InvitableSectionList
                key={section.clubId}
                {...section}
                onToggle={toggleUser}
                selectedUserIds={selectedUserIds}
              />
            ))
          : data?.users?.map((user) => (
              <InvitableUserList key={user.userId} {...user} onToggle={toggleUser} selectedUserIds={selectedUserIds} />
            ))}
      </div>
    </div>
  );
}
