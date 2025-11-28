export interface Club {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  description: string;
  tags: string[];
}

export interface ClubResponse {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
  clubs: Club[];
}

export interface ClubRequestParams {
  page: number;
  limit: number;
}
