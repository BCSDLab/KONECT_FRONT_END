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
    type: 'subpage',
    match: (pathname) => /^\/council\/notice\/\d+$/.test(pathname),
  },
  {
    type: 'default',
    match: (pathname) => /^\/clubs\/\d+$/.test(pathname),
  },
  {
    type: 'info',
    match: (pathname) =>
      pathname === '/home' || pathname === '/timer' || pathname === '/council' || pathname === '/mypage',
  },
  {
    type: 'chatList',
    match: (pathname) => pathname === '/chats',
  },
  {
    type: 'none',
    match: (pathname) => pathname === '/chats/add',
  },
  {
    type: 'chatSearch',
    match: (pathname) => pathname === '/chats/search',
  },
  {
    type: 'chat',
    match: (pathname) => /^\/chats\/\d+(?:\/info)?$/.test(pathname),
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
