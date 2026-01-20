import type { PaginationParams, PaginationResponse } from '../common/pagination';

export type NoticeRequestParams = PaginationParams;

export interface Notice {
  id: number;
  title: string;
  createdAt: string;
  isRead: boolean;
}

export interface NoticeResponse extends PaginationResponse {
  councilNotices: Notice[];
}

export interface CouncilResponse {
  id: number;
  name: string;
  introduce: string;
  location: string;
  personalColor: string;
  operatingHour: string;
  instagramUserName: string;
  imageUrl: string;
}

export interface CouncilNoticeDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
