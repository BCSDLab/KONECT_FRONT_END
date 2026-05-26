import type { ClubCategory } from '@/apis/common/club';

import type { UniversitySummary } from '../universityClub/entity';

export interface ClubDetailUniversitySummary extends UniversitySummary {
  clubCount: number;
}

export interface ClubDetailResponse {
  id: number;
  name: string;
  imageUrl: string;
  category: ClubCategory;
  categoryName: string;
  topic: string;
  description: string;
  introduce: string;
  location: string;
  university: ClubDetailUniversitySummary;
}
