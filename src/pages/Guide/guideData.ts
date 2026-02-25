export interface GuideItem {
  id: number;
  image: string;
  duration?: number;
}

export const GUIDE_ITEMS = [
  { id: 1, image: 'https://stage-static.koreatech.in/konect/guide/1-1%EB%B2%88.png', duration: 3000 },
  { id: 2, image: 'https://stage-static.koreatech.in/konect/guide/2-1%EB%B2%88.png', duration: 3000 },
  { id: 3, image: 'https://stage-static.koreatech.in/konect/guide/3-1%EB%B2%88.png', duration: 3000 },
  { id: 4, image: 'https://stage-static.koreatech.in/konect/guide/4%EB%B2%88.png', duration: 3000 },
  { id: 5, image: 'https://stage-static.koreatech.in/konect/guide/5%EB%B2%88.png', duration: 3000 },
];
