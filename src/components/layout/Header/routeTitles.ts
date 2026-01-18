export interface RouteTitle {
  match: (pathname: string) => boolean;
  title: string;
}

export const ROUTE_TITLES: RouteTitle[] = [
  {
    match: (pathname) => pathname === '/clubs',
    title: '동아리 전체보기',
  },
  {
    match: (pathname) => pathname.startsWith('/clubs/search'),
    title: '동아리 검색',
  },
  {
    match: (pathname) => pathname === '/chats',
    title: '채팅방',
  },
];
