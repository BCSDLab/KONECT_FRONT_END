import type { ClubCategory } from '@/apis/common/club';
import type { Region } from '@/apis/home/entity';

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
  clubCount: number;
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
  topic: string;
  description: string;
}

export interface UniversityClubListResponse {
  university: UniversitySummary;
  totalCount: number;
  totalPage: number;
  currentPage: number;
  categories: ClubCategorySummary[];
  clubs: UniversityClub[];
}
