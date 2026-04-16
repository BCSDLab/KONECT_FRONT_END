import type { ReactNode, Ref } from 'react';

export type HeaderType =
  | 'info'
  | 'chat'
  | 'none'
  | 'notification'
  | 'subpage'
  | 'default'
  | 'normal'
  | 'full'
  | 'signup'
  | 'schedule'
  | 'manager'
  | 'chatList'
  | 'chatSearch';

export interface HeaderConfig {
  type: HeaderType;
  match: (pathname: string) => boolean;
}

export interface HeaderRenderContext {
  title: string;
  onBack?: () => void;
  showNotificationBell?: boolean;
  headerRef: Ref<HTMLElement>;
}

export type HeaderRenderer = (ctx: HeaderRenderContext) => ReactNode;
