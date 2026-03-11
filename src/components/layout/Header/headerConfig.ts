import type { HeaderConfig } from './types';

export const HEADER_CONFIGS: HeaderConfig[] = [
  {
    type: 'none',
    match: (pathname) => pathname === '/',
  },
  {
    type: 'profile',
    match: (pathname) => pathname === '/mypage',
  },
  {
    type: 'info',
    match: (pathname) => pathname === '/home' || pathname === '/timer',
  },
  {
    type: 'chat',
    match: (pathname) => /^\/chats\/\d+$/.test(pathname),
  },
  {
    type: 'council',
    match: (pathname) => pathname === '/council',
  },
  {
    type: 'normal',
    match: (pathname) => pathname === '/signup/finish' || /^\/clubs\/\d+\/complete$/.test(pathname),
  },
  {
    type: 'full',
    match: (pathname) => /^\/mypage\/manager(?:\/[^/]+)?$/.test(pathname),
  },
  {
    type: 'signup',
    match: (pathname) => pathname === '/signup',
  },
  {
    type: 'schedule',
    match: (pathname) => pathname == '/schedule',
  },
];

export const DEFAULT_HEADER_TYPE: HeaderConfig['type'] = 'default';
