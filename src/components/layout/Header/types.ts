import type { ReactNode } from 'react';

export type HeaderType =
  | 'info'
  | 'profile'
  | 'chat'
  | 'none'
  | 'notification'
  | 'default'
  | 'normal'
  | 'full'
  | 'signup'
  | 'schedule'
  | 'council'
  | 'manager';

export interface HeaderConfig {
  type: HeaderType;
  match: (pathname: string) => boolean;
}

export interface HeaderRenderContext {
  title: string;
  onBack?: () => void;
  showNotificationBell?: boolean;
}

export type HeaderRenderer = (ctx: HeaderRenderContext) => ReactNode;
