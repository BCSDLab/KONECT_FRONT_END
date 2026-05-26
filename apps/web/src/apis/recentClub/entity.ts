import type { ClubCategory } from '@/apis/common/club';

export interface RecentClubRequestParams {
  clubIds: number[];
}

export interface RecentClub {
  id: number;
  name: string;
  imageUrl: string;
  category: ClubCategory;
  categoryName: string;
  topic: string;
  description: string;
}

export interface RecentClubResponse {
  clubs: RecentClub[];
}
