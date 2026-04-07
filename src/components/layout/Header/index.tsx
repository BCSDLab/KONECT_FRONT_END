import type { Ref } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatHeader from './components/ChatHeader';
import ChatListHeader from './components/ChatListHeader';
import DefaultHeader from './components/DefaultHeader';
import InfoHeader from './components/InfoHeader';
import ManagerHeader from './components/ManagerHeader';
import PlainSubpageHeader from './components/PlainSubpageHeader';
import ProfileHeader from './components/ProfileHeader';
import ScheduleHeader from './components/ScheduleHeader';
import SubpageHeader from './components/SubpageHeader';
import { getHeaderPresentation } from './presentation';
import type { HeaderType, HeaderRenderer } from './types';

interface HeaderProps {
  headerRef: Ref<HTMLElement>;
}

function Header({ headerRef }: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { title, type: headerType } = getHeaderPresentation(pathname);

  const HEADER_RENDERERS: Record<HeaderType, HeaderRenderer> = {
    profile: ({ headerRef }) => <ProfileHeader headerRef={headerRef} />,
    info: ({ headerRef }) => <InfoHeader headerRef={headerRef} />,
    chatList: ({ title, headerRef }) => <ChatListHeader title={title} headerRef={headerRef} />,
    chat: ({ headerRef }) => <ChatHeader headerRef={headerRef} />,
    none: () => null,
    notification: ({ title, headerRef }) => <SubpageHeader title={title} headerRef={headerRef} />,
    subpage: ({ title, headerRef }) => <PlainSubpageHeader title={title} headerRef={headerRef} />,
    schedule: ({ headerRef }) => <ScheduleHeader headerRef={headerRef} />,
    normal: ({ title, headerRef }) => <DefaultHeader title={title} headerRef={headerRef} showBackButton={false} />,
    full: ({ title, headerRef }) => <DefaultHeader title={title} headerRef={headerRef} showNotificationBell={true} />,
    signup: ({ title, onBack, headerRef }) => <DefaultHeader title={title} headerRef={headerRef} onBack={onBack} />,
    default: ({ title, headerRef }) => <DefaultHeader title={title} headerRef={headerRef} />,
    manager: ({ title, headerRef }) => <ManagerHeader fallbackTitle={title} headerRef={headerRef} />,
  };

  const onBack = headerType === 'signup' ? () => navigate('/') : undefined;
  const renderer = HEADER_RENDERERS[headerType];

  return <>{renderer({ title, onBack, headerRef })}</>;
}

export default Header;
