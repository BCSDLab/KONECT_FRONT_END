import { Link } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import clubImage from '@/assets/image/동아리 사진.png';
import ChatIcon from '@/assets/svg/chat.svg';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import FileSearchIcon from '@/assets/svg/file-search.svg';
import FileIcon from '@/assets/svg/file.svg';
import LayersIcon from '@/assets/svg/layers.svg';
import UserSquareIcon from '@/assets/svg/user-square.svg';
import UserIcon from '@/assets/svg/user.svg';
import Card from '@/components/common/Card';

const menuItems = [
  { to: 'profile', icon: UserIcon, label: '내 정보' },
  { to: '/legal/oss', icon: FileSearchIcon, label: '오픈소스 라이선스' },
  { to: '/legal/terms', icon: FileIcon, label: '코넥트 약관 확인' },
  { to: '/legal/privacy', icon: UserSquareIcon, label: '개인정보 처리 방침' },
  { to: '/contact', icon: ChatIcon, label: '문의하기' },
  { to: '/version', icon: LayersIcon, label: '버전관리', rightText: 'v1.0.0' },
];

function MyPage() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <Card>
        <div className="flex items-center gap-3">
          <img className="h-12 w-12 rounded-full" src={clubImage} alt="Member Avatar" />
          <div>
            <div className="text-lg leading-4.5 font-bold text-indigo-700">김혜준</div>
            <div className="mt-1.5 text-xs leading-3.5 font-medium text-indigo-300">2022136039 · 컴퓨터공학부</div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-[10px] leading-3">가입 동아리</div>
            <div className="mt-1 text-sm leading-3 font-bold">3</div>
          </div>
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-[10px] leading-3">미납 회비</div>
            <div className="mt-1 text-sm leading-3 font-bold">1</div>
          </div>
          <div className="bg-indigo-5 flex-1 rounded-sm p-3 text-center">
            <div className="text-[10px] leading-3">읽지 않은 공지</div>
            <div className="mt-1 text-sm leading-3 font-bold">5</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-2 rounded-sm bg-white p-2">
        {menuItems.map(({ to, icon: Icon, label, rightText }) => (
          <Link key={to} to={to} className="bg-indigo-0 active:bg-indigo-5 rounded-sm transition-colors">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-4">
                <Icon />
                <div className="text-sm leading-4 font-semibold">{label}</div>
              </div>
              {rightText ? (
                <div className="text-[13px] leading-4 text-indigo-200">{rightText}</div>
              ) : (
                <RightArrowIcon />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyPage;
