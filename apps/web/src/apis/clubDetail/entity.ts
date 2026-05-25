import type { UniversitySummary } from '../universityClub/entity';
export type ClubCategory = 'ACADEMIC' | 'SPORTS' | 'HOBBY' | 'RELIGION' | 'PERFORMANCE' | 'JUNIOR';
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
  university: UniversitySummary;
}
