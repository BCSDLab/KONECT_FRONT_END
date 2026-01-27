import { Link } from 'react-router-dom';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import LayersIcon from '@/assets/svg/layers.svg';
import LogoutIcon from '@/assets/svg/logout.svg';
import UserIdCardIcon from '@/assets/svg/user-id-card.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import UserIcon from '@/assets/svg/user.svg';
import BottomModal from '@/components/common/BottomModal';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useMyInfo } from '../Profile/hooks/useMyInfo';
import UserInfoCard from './components/UserInfoCard';
import { useLogoutMutation } from './hooks/useLogout';

const menuItems = [
  { to: '/profile', icon: UserIcon, label: '내 정보' },
  { to: '/legal/oss', icon: FileSearchIcon, label: '오픈소스 라이선스' },
  { to: '/legal/terms', icon: FileIcon, label: '코넥트 약관 확인' },
  { to: '/legal/privacy', icon: UserSquareIcon, label: '개인정보 처리 방침' },
  { to: '/chats', icon: ChatIcon, label: '문의하기' },
  { to: 'manager', icon: UserIdCardIcon, label: '관리자 페이지' },
];

function MyPage() {
  const { myInfo } = useMyInfo();
  const { mutate: logout } = useLogoutMutation();
  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);

  return (
    <div className="flex flex-col gap-2 p-3">
      <UserInfoCard />
      <div className="flex flex-col gap-2 rounded-sm bg-white p-2">
        {menuItems
          .filter(({ to }) => to !== '/mypage/manager' || myInfo.isClubManager)
          .map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-4">
                  <Icon />
                  <div className="text-sub2">{label}</div>
                </div>
                <RightArrowIcon />
              </div>
            </Link>
          ))}

        <div className="bg-indigo-0 rounded-sm">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-4">
              <LayersIcon />
              <div className="text-sm leading-4 font-semibold">버전관리</div>
            </div>
            <div className="text-[13px] leading-4 text-indigo-200">v1.0.0</div>
          </div>
        </div>
        <button className="bg-indigo-0 flex items-center rounded-sm px-3 py-2" onClick={openModal}>
          <div className="flex items-center gap-4">
            <LogoutIcon />
            <div className="text-sm leading-4 font-semibold">로그아웃</div>
          </div>
        </button>
      </div>

      <BottomModal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">정말로 로그아웃 하시겠어요?</div>
          <div>
            <button
              onClick={() => logout()}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white"
            >
              로그아웃
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
