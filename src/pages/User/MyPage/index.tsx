import { Link, useNavigate } from 'react-router-dom';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import LayersIcon from '@/assets/svg/layers.svg';
import LogoutIcon from '@/assets/svg/logout.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import UserIcon from '@/assets/svg/user.svg';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useMyInfo } from '../Profile/hooks/useMyInfo';
import { useLogoutMutation } from './hooks/useLogout';

const menuItems = [
  { to: '/profile', icon: UserIcon, label: '내 정보' },
  { to: '/legal/oss', icon: FileSearchIcon, label: '오픈소스 라이선스' },
  { to: '/legal/terms', icon: FileIcon, label: '코넥트 약관 확인' },
  { to: '/legal/privacy', icon: UserSquareIcon, label: '개인정보 처리 방침' },
  { to: '/chats', icon: ChatIcon, label: '문의하기' },
];

function MyPage() {
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();
  const { mutate: logout } = useLogoutMutation();
  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);

  const handleClick = (to: string) => {
    navigate(to);
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      <Card>
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full" src={myInfo.imageUrl} alt="Member Avatar" />
          <div>
            <div className="text-lg leading-4.5 font-bold text-indigo-700">{myInfo.name}</div>
            <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">
              {myInfo.studentNumber} · {myInfo.universityName}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-[10px] leading-3">가입 동아리</div>
            <div className="mt-1 text-sm leading-3 font-bold">{myInfo.joinedClubCount}</div>
          </div>
          <button onClick={() => handleClick('/timer')} className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-[10px] leading-3">순공 시간</div>
            <div className="mt-1 text-sm leading-3 font-bold">{myInfo.studyTime}</div>
          </button>
          <button
            onClick={() => handleClick('/council?tab=notice')}
            className="bg-indigo-5 flex-1 rounded-sm p-3 text-center"
          >
            <div className="text-[10px] leading-3">읽지 않은 공지</div>
            <div className="mt-1 text-sm leading-3 font-bold">{myInfo.unreadCouncilNoticeCount}</div>
          </button>
        </div>
      </Card>

      <div className="flex flex-col gap-2 rounded-sm bg-white p-2">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-4">
                <Icon />
                <div className="text-sm leading-4 font-semibold">{label}</div>
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
