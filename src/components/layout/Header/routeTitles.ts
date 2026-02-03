export interface RouteTitle {
  match: (pathname: string) => boolean;
  title: string;
}

export const ROUTE_TITLES: RouteTitle[] = [
  {
    match: (pathname) => pathname.startsWith('/clubs/search'),
    title: '동아리 검색',
  },
  {
    match: (pathname) => pathname === '/chats',
    title: '채팅방',
  },
  {
    match: (pathname) => pathname === '/council',
    title: '총동아리연합회',
  },
];
