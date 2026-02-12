export interface GuideItem {
  id: number;
  image: string;
  duration?: number;
}

export const GUIDE_ITEMS = [
  { id: 1, image: 'https://stage-static.koreatech.in/konect/guide/1%EB%B2%88.png', duration: 3000 },
  { id: 2, image: 'https://stage-static.koreatech.in/konect/guide/2%EB%B2%88.png', duration: 3000 },
  { id: 3, image: 'https://stage-static.koreatech.in/konect/guide/3%EB%B2%88.png', duration: 4000 },
];
