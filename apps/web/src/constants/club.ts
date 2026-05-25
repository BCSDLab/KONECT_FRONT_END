import type { ClubCategory } from '@/apis/universityClub/entity';

export const CATEGORY_TEXT_COLORS: Record<ClubCategory, string> = {
  ACADEMIC: 'text-primary-500',
  SPORTS: 'text-info-600',
  HOBBY: 'text-danger-600',
  RELIGION: 'text-warning-700',
  PERFORMANCE: 'text-[#cd3bf6]',
  JUNIOR: 'text-success-700',
};
