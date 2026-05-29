export const CLUB_CATEGORY = {
  ACADEMIC: 'ACADEMIC',
  SPORTS: 'SPORTS',
  HOBBY: 'HOBBY',
  RELIGION: 'RELIGION',
  PERFORMANCE: 'PERFORMANCE',
  SOCIAL_SERVICE: 'SOCIAL_SERVICE',
  EXHIBITION_CREATION: 'EXHIBITION_CREATION',
  ETC: 'ETC',
  JUNIOR: 'JUNIOR',
} as const;

export type ClubCategory = (typeof CLUB_CATEGORY)[keyof typeof CLUB_CATEGORY];

export const CLUB_CATEGORY_VALUES = Object.values(CLUB_CATEGORY);

export function isClubCategory(value: string | null | undefined): value is ClubCategory {
  return typeof value === 'string' && CLUB_CATEGORY_VALUES.includes(value as ClubCategory);
}
