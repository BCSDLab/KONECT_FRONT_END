import { DEFAULT_HEADER_TYPE, HEADER_CONFIGS } from './headerConfig';
import { ROUTE_TITLES } from './routeTitles';
import type { HeaderType } from './types';

interface HeaderPresentation {
  type: HeaderType;
  title: string;
  hasHeader: boolean;
  contentPaddingClassName: string | null;
}

function getHeaderType(pathname: string): HeaderType {
  return HEADER_CONFIGS.find((config) => config.match(pathname))?.type ?? DEFAULT_HEADER_TYPE;
}

function getHeaderTitle(pathname: string) {
  return ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';
}

function getHeaderContentPaddingClassName(type: HeaderType) {
  if (type === 'none') {
    return null;
  }

  if (type === 'info') {
    return 'pt-15';
  }

  if (type === 'manager' || type === 'notification') {
    return 'pt-(--subpage-header-height)';
  }

  return 'pt-11';
}

export function getHeaderPresentation(pathname: string): HeaderPresentation {
  const type = getHeaderType(pathname);

  return {
    type,
    title: getHeaderTitle(pathname),
    hasHeader: type !== 'none',
    contentPaddingClassName: getHeaderContentPaddingClassName(type),
  };
}
