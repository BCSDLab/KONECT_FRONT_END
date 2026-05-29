import { CLUB_CATEGORY, type ClubCategory } from '@/apis/common/club';

export const CATEGORY_TEXT_COLORS: Record<ClubCategory, string> = {
  [CLUB_CATEGORY.ACADEMIC]: 'text-primary-500',
  [CLUB_CATEGORY.SPORTS]: 'text-info-600',
  [CLUB_CATEGORY.HOBBY]: 'text-danger-600',
  [CLUB_CATEGORY.RELIGION]: 'text-warning-700',
  [CLUB_CATEGORY.PERFORMANCE]: 'text-[#cd3bf6]',
  [CLUB_CATEGORY.SOCIAL_SERVICE]: 'text-success-700',
  [CLUB_CATEGORY.EXHIBITION_CREATION]: 'text-[#7c3aed]',
  [CLUB_CATEGORY.ETC]: 'text-text-500',
  [CLUB_CATEGORY.JUNIOR]: 'text-success-700',
};
