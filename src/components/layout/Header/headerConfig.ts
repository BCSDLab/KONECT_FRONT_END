import type { HeaderConfig } from './types';

export const HEADER_CONFIGS: HeaderConfig[] = [
  {
    type: 'profile',
    match: (pathname) => pathname === '/me',
  },
  {
    type: 'info',
    match: (pathname) => pathname === '/home' || pathname === '/council' || pathname === '/timer',
  },
  {
    type: 'chat',
    match: (pathname) => /^\/chats\/\d+$/.test(pathname),
  },
  {
    type: 'normal',
    match: (pathname) => pathname === '/',
  },
  {
    type: 'signup',
    match: (pathname) => pathname === '/signup',
  },
];

export const DEFAULT_HEADER_TYPE: HeaderConfig['type'] = 'default';
