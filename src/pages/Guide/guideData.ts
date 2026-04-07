export interface GuideItem {
  id: number;
  image: string;
  duration?: number;
}

const GUIDE_IMAGE_BASE_URL = 'https://stage-static.koreatech.in/konect/guide';
const GUIDE_ITEM_DURATION = 3000;

const GUIDE_IMAGE_FILE_NAMES = ['가이드1.webp', '가이드2.webp', '가이드3.webp', '가이드4.webp', '순공시간_개인별.webp'];

const getGuideImageUrl = (fileName: string) => `${GUIDE_IMAGE_BASE_URL}/${encodeURIComponent(fileName)}`;

export const GUIDE_ITEMS: GuideItem[] = GUIDE_IMAGE_FILE_NAMES.map((fileName, index) => ({
  id: index + 1,
  image: getGuideImageUrl(fileName),
  duration: GUIDE_ITEM_DURATION,
}));
