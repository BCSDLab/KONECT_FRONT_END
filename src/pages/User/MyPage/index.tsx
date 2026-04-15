import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/Chevron-left-dark.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import LayersIcon from '@/assets/svg/layers.svg';
import LogoutIcon from '@/assets/svg/logout.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import BottomModal from '@/components/common/BottomModal';
import { MyPageActionRow, MyPageInfoRow, MyPageLinkRow } from '@/pages/User/MyPage/components/MyPageRows';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useAdminChatMutation } from '../hooks/useAdminChatMutation';
import UserInfoCard from './components/UserInfoCard';
import { useLogoutMutation } from './hooks/useLogout';

interface LegalMenuState {
  backPath: string;
}

interface MenuItem {
  to: string;
  icon: typeof ChatIcon;
  label: string;
  state?: LegalMenuState;
}

interface ManagedClubSummary {
  id: number;
  name: string;
  categoryName: string;
  imageUrl: string;
}

interface ManagedClubLinkProps {
  club: ManagedClubSummary;
}

const menuItems: MenuItem[] = [
  { to: '/legal/oss', icon: FileSearchIcon, label: '오픈소스 라이선스', state: { backPath: '/mypage' } },
  { to: '/legal/terms', icon: FileIcon, label: '코넥트 약관 확인', state: { backPath: '/mypage' } },
  { to: '/legal/privacy', icon: UserSquareIcon, label: '개인정보 처리 방침', state: { backPath: '/mypage' } },
];

function ManagedClubLink({ club }: ManagedClubLinkProps) {
  return (
    <Link to={`manager/${club.id}`} className="active:bg-indigo-5 flex items-center justify-between transition-colors">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <img
          src={club.imageUrl}
          alt="Club Avatar"
          className="border-indigo-5 h-12 w-12 rounded-sm border object-cover"
        />
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-sub2 truncate text-indigo-700">{club.name}</span>
          <span className="text-cap1 truncate text-indigo-300">{club.categoryName}</span>
        </div>
      </div>
      <RightArrowIcon />
    </Link>
  );
}

function MyPage() {
  const { data: managedClubList } = useSuspenseQuery(managedClubQueries.clubs());
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();
  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);
  const { mutate: goToAdminChat, isPending: isCreatingAdminChat } = useAdminChatMutation();

  return (
    <div className="flex flex-col gap-5 p-3 pt-3">
      <UserInfoCard />

      <section className="flex flex-col gap-2">
        <span className="text-text-700 leading-4.5 font-semibold">관리중인 동아리</span>
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-3">
          {managedClubList.joinedClubs.map((club) => (
            <ManagedClubLink key={club.id} club={club} />
          ))}
        </div>
      </section>
      <div className="flex flex-col gap-2 rounded-2xl bg-white px-3 py-2">
        {menuItems.map(({ to, icon, label, state }) => (
          <Link key={to} to={to} state={state} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
            <MyPageLinkRow icon={icon} label={label} />
          </Link>
        ))}

        <button
          disabled={isCreatingAdminChat}
          onClick={() => goToAdminChat()}
          className="bg-indigo-0 active:bg-indigo-5 w-full rounded-sm text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MyPageLinkRow icon={ChatIcon} label={isCreatingAdminChat ? '이동 중...' : '문의하기'} />
        </button>

        <div className="bg-indigo-0 rounded-sm">
          <MyPageInfoRow
            icon={LayersIcon}
            label="버전관리"
            value={window.APP_VERSION ? `v${window.APP_VERSION}` : '-'}
          />
        </div>
        <button className="bg-indigo-0 rounded-sm" onClick={openModal}>
          <MyPageActionRow icon={LogoutIcon} label="로그아웃" />
        </button>
      </div>

      <BottomModal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">정말로 로그아웃 하시겠어요?</div>
          <div>
            <button
              disabled={isLoggingOut}
              onClick={() => logout()}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </button>
            <button onClick={closeModal} className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400">
              취소
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default MyPage;
