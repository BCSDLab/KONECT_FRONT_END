import { startTransition, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { InvitableSection, InvitableUser, SortBy } from '@/apis/chat/entity';
import { chatQueries } from '@/apis/chat/queries';
import SearchIcon from '@/assets/svg/big-search-icon.svg';
import CheckIcon from '@/assets/svg/check_color.svg';
import Dropdown from '@/components/common/Dropdown';
import { MemberAvatar } from '@/components/common/MemberAvatar';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import ChatAddHeader from '@/components/layout/Header/components/ChatAddHeader';
import { getHeaderPresentation } from '@/components/layout/Header/presentation';
import { useCreateChatRoomGroupMutation, useInviteChatRoomMembersMutation } from '@/pages/Chat/hooks/useChatMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useDebouncedCallback from '@/utils/hooks/useDebounce';
import { isApiError } from '@/utils/ts/error/apiError';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/error/errorRedirect';

interface UserListProps {
  onToggle: (userId: number) => void;
  selectedUserIds: Set<number>;
}

interface InvitableUserItemProps extends UserListProps, Pick<InvitableUser, 'name' | 'studentNumber' | 'userId'> {}

function InvitableUserItem({ userId, name, studentNumber, onToggle, selectedUserIds }: InvitableUserItemProps) {
  const isSelected = selectedUserIds.has(userId);

  return (
    <button type="button" className="flex items-center gap-3 text-left" onClick={() => onToggle(userId)}>
      <MemberAvatar name={name} />
      <span className="flex w-full items-center text-[15px] leading-[1.6] font-semibold text-indigo-700">
        {name} ({studentNumber})
      </span>
      {isSelected && <CheckIcon className="size-6.5" />}
    </button>
  );
}

function InvitableSectionList({ clubName, users, onToggle, selectedUserIds }: InvitableSection & UserListProps) {
  return (
    <section className="flex flex-col gap-3">
      <p className="text-text-700 text-[14px] leading-5">{clubName}</p>
      <div className="flex flex-col gap-5">
        {users.map((user) => (
          <InvitableUserItem key={user.userId} {...user} onToggle={onToggle} selectedUserIds={selectedUserIds} />
        ))}
      </div>
    </section>
  );
}

function InvitableUserList({ users, onToggle, selectedUserIds }: { users: InvitableUser[] } & UserListProps) {
  return (
    <div className="flex flex-col gap-5">
      {users.map((user) => (
        <InvitableUserItem key={user.userId} {...user} onToggle={onToggle} selectedUserIds={selectedUserIds} />
      ))}
    </div>
  );
}

const SORT_OPTIONS = [
  { value: 'CLUB', label: '동아리' },
  { value: 'NAME', label: '이름' },
] as const;

export default function AddChatRoom() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { chatRoomId } = useParams<{ chatRoomId?: string }>();
  const { title } = getHeaderPresentation(pathname);
  const numericRoomId = chatRoomId ? Number(chatRoomId) : undefined;
  const isInviteMode = numericRoomId != null && Number.isFinite(numericRoomId);
  const showApiErrorToast = useApiErrorToast();
  const { mutateAsync: createRoomGroup, isPending: isCreatingRoomGroup } = useCreateChatRoomGroupMutation();
  const { mutateAsync: inviteChatRoomMembers, isPending: isInvitingChatRoomMembers } =
    useInviteChatRoomMembersMutation();

  const [keyword, setKeyword] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('CLUB');
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const { data, isFetching, isPending } = useQuery({
    ...chatQueries.invite(debouncedQuery, sortBy),
    placeholderData: keepPreviousData,
  });
  const { data: chatRoomMembersData } = useQuery(chatQueries.members(isInviteMode ? numericRoomId : undefined));
  const hasData = data != null;
  const currentRoomMemberIds = new Set(chatRoomMembersData?.members.map((member) => member.userId) ?? []);
  const filteredSections =
    data?.grouped === true
      ? data.sections
          .map((section) => ({
            ...section,
            users: section.users.filter((user) => !currentRoomMemberIds.has(user.userId)),
          }))
          .filter((section) => section.users.length > 0)
      : [];
  const filteredUsers =
    data?.grouped === false ? data.users.filter((user) => !currentRoomMemberIds.has(user.userId)) : [];
  const visibleSelectedUserIds = (() => {
    if (!data) {
      return [];
    }

    if (data.grouped) {
      return Array.from(selectedUserIds).filter((selectedUserId) =>
        filteredSections.some((section) => section.users.some((user) => user.userId === selectedUserId))
      );
    }

    return Array.from(selectedUserIds).filter((selectedUserId) =>
      filteredUsers.some((user) => user.userId === selectedUserId)
    );
  })();
  const isSubmitting = isCreatingRoomGroup || isInvitingChatRoomMembers;

  const onConfirm = async () => {
    if (visibleSelectedUserIds.length === 0 || isSubmitting) {
      return;
    }

    try {
      if (isInviteMode && numericRoomId != null) {
        await inviteChatRoomMembers({
          chatRoomId: numericRoomId,
          userIds: visibleSelectedUserIds,
        });
        navigate(`/chats/${numericRoomId}/info`, { replace: true });
        return;
      }

      const result = await createRoomGroup(visibleSelectedUserIds);
      navigate(`/chats/${result.chatRoomId}`);
    } catch (error) {
      if (isApiError(error) && isServerErrorStatus(error.status)) {
        redirectToServerErrorPage();
        return;
      }

      showApiErrorToast(error, isInviteMode ? '멤버 초대에 실패했습니다.' : '채팅방 생성에 실패했습니다.');
    }
  };

  const updateDebouncedQuery = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    startTransition(() => {
      setSelectedUserIds(new Set());
      setDebouncedQuery(trimmed);
    });
  }, 300);

  const handleChange = (value: string) => {
    setKeyword(value);
    updateDebouncedQuery(value);
  };

  const handleSortChange = (value: SortBy) => {
    startTransition(() => {
      setSelectedUserIds(new Set());
      setSortBy(value);
    });
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

  const invitableListContent = (() => {
    if (!data) {
      return null;
    }

    if (data.grouped) {
      return filteredSections.map((section) => (
        <InvitableSectionList
          key={section.clubId}
          {...section}
          onToggle={toggleUser}
          selectedUserIds={selectedUserIds}
        />
      ));
    }

    return <InvitableUserList users={filteredUsers} onToggle={toggleUser} selectedUserIds={selectedUserIds} />;
  })();
  const selectedCount = visibleSelectedUserIds.length;
  const isInvitableListEmpty = data
    ? data.grouped
      ? filteredSections.length === 0
      : filteredUsers.length === 0
    : false;
  const emptyMessage = keyword.trim()
    ? '검색 결과가 없어요.'
    : isInviteMode
      ? '초대할 수 있는 친구가 없어요.'
      : '선택할 수 있는 친구가 없어요.';
  const isConfirmDisabled = selectedCount === 0 || isSubmitting;

  return (
    <div className="flex h-full flex-col items-center px-5 pt-19">
      <ChatAddHeader title={title} onConfirm={onConfirm} disabled={isConfirmDisabled} />

      <div className="flex w-full shrink-0 items-center overflow-hidden rounded-full bg-white px-5 py-2.5">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 text-[15px] leading-[1.6] text-indigo-300"
          placeholder="이름, 학번 검색"
        />
        <SearchIcon />
      </div>

      <div className="scrollbar-hidden mt-6 flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto rounded-t-2xl bg-white px-5 py-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-text-700 text-[15px] leading-5">친구 선택 ({selectedCount})</span>
          <Dropdown
            className="w-19"
            triggerClassName="w-full"
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={handleSortChange}
          />
        </div>

        {isPending && !hasData ? (
          <RouteLoadingFallback />
        ) : (
          <>
            {isInvitableListEmpty ? (
              <div className="text-text-400 flex flex-1 items-center justify-center text-[14px] leading-[1.6]">
                {emptyMessage}
              </div>
            ) : (
              invitableListContent
            )}
            {isFetching && hasData && (
              <div className="text-text-400 flex justify-center text-xs leading-[1.6]">불러오는 중...</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
