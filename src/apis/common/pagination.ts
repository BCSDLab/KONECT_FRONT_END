export interface PaginationResponse {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
