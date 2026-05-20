import type { Region } from '@/apis/home/entity';

export type ClubCategory = 'ACADEMIC' | 'SPORTS' | 'HOBBY' | 'RELIGION' | 'PERFORMANCE' | 'JUNIOR';

export interface UniversityClubListRequestParams {
  page?: number;
  limit?: number;
  query?: string;
  category?: ClubCategory;
}

export interface UniversitySummary {
  id: number;
  name: string;
  campusName: string;
  region: Region;
  regionName: string;
  imageUrl: string;
}

export interface ClubCategorySummary {
  category: ClubCategory;
  categoryName: string;
  count: number;
}

export interface UniversityClub {
  id: number;
  name: string;
  imageUrl: string;
  category: ClubCategory;
  categoryName: string;
  description: string;
  memberCount: number;
}

export interface UniversityClubListResponse {
  university: UniversitySummary;
  totalCount: number;
  totalPage: number;
  currentPage: number;
  categories: ClubCategorySummary[];
  clubs: UniversityClub[];
}
