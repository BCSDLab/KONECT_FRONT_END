import { useLocation, useNavigate } from 'react-router-dom';
import ChatHeader from './components/ChatHeader';
import DefaultHeader from './components/DefaultHeader';
import InfoHeader from './components/InfoHeader';
import ProfileHeader from './components/ProfileHeader';
import ScheduleHeader from './components/ScheduleHeader';
import { HEADER_CONFIGS, DEFAULT_HEADER_TYPE } from './headerConfig';
import { ROUTE_TITLES } from './routeTitles';
import type { HeaderType, HeaderRenderer } from './types';

function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';
  const headerConfig = HEADER_CONFIGS.find((config) => config.match(pathname));
  const headerType = headerConfig?.type ?? DEFAULT_HEADER_TYPE;

  const HEADER_RENDERERS: Record<HeaderType, HeaderRenderer> = {
    profile: () => <ProfileHeader />,
    info: () => <InfoHeader />,
    chat: () => <ChatHeader />,
    schedule: () => <ScheduleHeader />,
    normal: ({ title }) => <DefaultHeader title={title} showBackButton={false} />,
    full: ({ title }) => <DefaultHeader title={title} showNotificationBell={true} />,
    signup: ({ title, onBack }) => <DefaultHeader title={title} onBack={onBack} />,
    council: ({ title }) => <DefaultHeader title={title} />,
    default: ({ title }) => <DefaultHeader title={title} />,
  };

  const onBack = headerType === 'signup' ? () => navigate('/') : undefined;
  const renderer = HEADER_RENDERERS[headerType];

  return <>{renderer({ title, onBack })}</>;
}

export default Header;
