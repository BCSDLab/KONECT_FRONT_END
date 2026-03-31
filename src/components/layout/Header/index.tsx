import { useLocation, useNavigate } from 'react-router-dom';
import ChatHeader from './components/ChatHeader';
import DefaultHeader from './components/DefaultHeader';
import InfoHeader from './components/InfoHeader';
import ManagerHeader from './components/ManagerHeader';
import PlainSubpageHeader from './components/PlainSubpageHeader';
import ProfileHeader from './components/ProfileHeader';
import ScheduleHeader from './components/ScheduleHeader';
import SubpageHeader from './components/SubpageHeader';
import { getHeaderPresentation } from './presentation';
import type { HeaderType, HeaderRenderer } from './types';

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { title, type: headerType } = getHeaderPresentation(pathname);

  const HEADER_RENDERERS: Record<HeaderType, HeaderRenderer> = {
    profile: () => <ProfileHeader />,
    info: () => <InfoHeader />,
    chat: () => <ChatHeader />,
    none: () => null,
    notification: ({ title }) => <SubpageHeader title={title} />,
    subpage: ({ title }) => <PlainSubpageHeader title={title} />,
    schedule: () => <ScheduleHeader />,
    normal: ({ title }) => <DefaultHeader title={title} showBackButton={false} />,
    full: ({ title }) => <DefaultHeader title={title} showNotificationBell={true} />,
    signup: ({ title, onBack }) => <DefaultHeader title={title} onBack={onBack} />,
    council: ({ title }) => <DefaultHeader title={title} />,
    default: ({ title }) => <DefaultHeader title={title} />,
    manager: ({ title }) => <ManagerHeader fallbackTitle={title} />,
  };

  const onBack = headerType === 'signup' ? () => navigate('/') : undefined;
  const renderer = HEADER_RENDERERS[headerType];

  return <>{renderer({ title, onBack })}</>;
}

export default Header;
