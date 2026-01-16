import type { ReactNode } from 'react';

export type HeaderType = 'info' | 'profile' | 'chat' | 'default' | 'normal' | 'signup' | 'schedule';

export interface HeaderConfig {
  type: HeaderType;
  match: (pathname: string) => boolean;
}

export interface HeaderRenderContext {
  title: string;
  onBack?: () => void;
}

export type HeaderRenderer = (ctx: HeaderRenderContext) => ReactNode;
