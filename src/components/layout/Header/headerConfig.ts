import type { HeaderConfig } from './types';

export const HEADER_CONFIGS: HeaderConfig[] = [
  {
    type: 'none',
    match: (pathname) => pathname === '/',
  },
  {
    type: 'notification',
    match: (pathname) => pathname === '/notifications',
  },
  {
    type: 'default',
    match: (pathname) => /^\/clubs\/\d+$/.test(pathname),
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
    type: 'chatList',
    match: (pathname) => pathname === '/chats',
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
    type: 'manager',
    match: (pathname) => pathname.startsWith('/mypage/manager'),
  },
  {
    type: 'signup',
    match: (pathname) => pathname === '/signup',
  },
  {
    type: 'schedule',
    match: (pathname) => pathname === '/schedule',
  },
];

export const DEFAULT_HEADER_TYPE: HeaderConfig['type'] = 'default';
