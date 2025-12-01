export interface NoticeRequestParams {
  page: number;
  limit: number;
}

export interface Notice {
  id: number;
  title: string;
  createdAt: string;
}

export interface NoticeResponse {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
  councilNotices: Notice[];
}
