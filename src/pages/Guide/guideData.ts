import guide1 from '@/assets/image/1번.png';
import guide2 from '@/assets/image/2번.png';
import guide3 from '@/assets/image/3번.png';

export interface GuideItem {
  id: number;
  image: string;
  duration?: number;
}

export const GUIDE_ITEMS = [
  { id: 1, image: guide1, duration: 3000 },
  { id: 2, image: guide2, duration: 3000 },
  { id: 3, image: guide3, duration: 4000 },
];
