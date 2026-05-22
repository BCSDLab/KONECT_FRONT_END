import type { UniversitySummary } from '../universityClub/entity';
export type ClubCategory = 'ACADEMIC' | 'SPORTS' | 'HOBBY' | 'RELIGION' | 'PERFORMANCE' | 'JUNIOR';
export interface ClubDetailResponse {
  id: number;
  name: string;
  imageUrl: string;
  category: ClubCategory;
  categoryName: string;
  description: string;
  introduce: string;
  location: string;
  memberCount: number;
  university: UniversitySummary;
  recruitment: Recruitment;
}

export interface Recruitment {
  isRecruitmentEnabled: boolean;
  isAlwaysRecruiting: boolean;
  startAt: string | null;
  endAt: string | null;
  content: string;
}
