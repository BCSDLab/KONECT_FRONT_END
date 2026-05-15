import { DEFAULT_HEADER_TYPE, HEADER_CONFIGS } from './headerConfig';
import { ROUTE_TITLES } from './routeTitles';
import type { HeaderType } from './types';

interface HeaderPresentation {
  type: HeaderType;
  title: string;
  hasHeader: boolean;
}

function getHeaderType(pathname: string): HeaderType {
  return HEADER_CONFIGS.find((config) => config.match(pathname))?.type ?? DEFAULT_HEADER_TYPE;
}

function getHeaderTitle(pathname: string) {
  return ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';
}

export function getHeaderPresentation(pathname: string): HeaderPresentation {
  const type = getHeaderType(pathname);

  return {
    type,
    title: getHeaderTitle(pathname),
    hasHeader: type !== 'none',
  };
}
