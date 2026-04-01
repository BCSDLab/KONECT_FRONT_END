export interface RouteTitle {
  match: (pathname: string) => boolean;
  title: string;
}

export const ROUTE_TITLES: RouteTitle[] = [
  {
    match: (pathname) => pathname === '/mypage/manager',
    title: '동아리 관리',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/members$/.test(pathname),
    title: '부원관리',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/members\/\d+\/application$/.test(pathname),
    title: '지원서 보기',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/info$/.test(pathname),
    title: '정보 수정하기',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/applications$/.test(pathname),
    title: '지원자 관리',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/applications\/\d+$/.test(pathname),
    title: '지원서 보기',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/recruitment$/.test(pathname),
    title: '모집 공고 및 지원서 관리',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/recruitment\/write$/.test(pathname),
    title: '모집 공고',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/recruitment\/form$/.test(pathname),
    title: '지원서',
  },
  {
    match: (pathname) => /^\/mypage\/manager\/\d+\/recruitment\/account$/.test(pathname),
    title: '가입비',
  },
  {
    match: (pathname) => pathname.startsWith('/clubs/search'),
    title: '동아리 검색',
  },
  {
    match: (pathname) => pathname === '/council',
    title: '총동아리연합회',
  },
  {
    match: (pathname) => /^\/council\/notice\/\d+$/.test(pathname),
    title: '공지사항',
  },
  {
    match: (pathname) => pathname === '/notifications',
    title: '알림',
  },
];
