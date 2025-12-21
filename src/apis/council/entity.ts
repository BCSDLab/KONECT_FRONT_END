export interface NoticeRequestParams {
  page: number;
  limit: number;
}

export interface Notice {
  id: number;
  title: string;
  createdAt: string;
  isRead: boolean;
}

export interface NoticeResponse {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
  councilNotices: Notice[];
}

export interface CouncilResponse {
  id: number;
  name: string;
  introduce: string;
  location: string;
  personalColor: string;
  operatingHour: string;
  instagramUrl: string;
  imageUrl: string;
}

export interface CouncilNoticeDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
