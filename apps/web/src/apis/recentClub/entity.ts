import type { ClubCategory, ClubCategorySummary, UniversitySummary } from '@/apis/universityClub/entity';

export interface RecentClubListRequestParams {
  clubIds: number[];
}

export interface RecentClub {
  id: number;
  name: string;
  imageUrl?: string;
  category: ClubCategory;
  categoryName: string;
  topic?: string;
  description?: string;
}

export interface RecentClubListResponse {
  university: UniversitySummary;
  totalCount: number;
  totalPage: number;
  currentPage: number;
  categories: ClubCategorySummary[];
  clubs: RecentClub[];
}
