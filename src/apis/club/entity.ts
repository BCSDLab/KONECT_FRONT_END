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
  isRecruiting: boolean;
  query?: string;
}

export interface JoinClub {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  position: '일반 회원' | '운영진' | '회장';
  isFeePaid: boolean;
}

export interface JoinClubResponse {
  joinedClubs: JoinClub[];
}

export interface ClubDetailResponse {
  id: number;
  name: string;
  location: string;
  description: string;
  introduce: string;
  imageUrl: string;
  categoryName: string;
  memberCount: number;
  recruitment: Recruitment;
  representatives: Representatives[];
  isMember: boolean;
  isApplied: boolean;
}

interface Recruitment {
  status: 'BEFORE' | 'ONGOING' | 'CLOSED';
  startDate?: string;
  endDate?: string;
}

interface Representatives {
  name: string;
  phone: string;
  email: string;
}

export interface ClubMember {
  name: string;
  imageUrl: string;
  studentNumber: string;
  position: '회장' | '운영진' | '일반 회원';
}

export interface ClubMembersResponse {
  clubMembers: ClubMember[];
}

export interface ClubQuestion {
  id: number;
  question: string;
  isRequired: boolean;
}

export interface ClubQuestionsResponse {
  questions: ClubQuestion[];
}

interface Answer {
  questionId: number;
  answer: string;
}

export interface ClubApplyRequest {
  answers: Answer[];
}

export interface ClubApplyResponse {
  amount?: number;
  bank?: string;
  accountNumber?: string;
  accountHolder?: string;
  deadLine?: string;
}

export interface ClubRecruitment {
  id: number;
  clubId: number;
  status: 'BEFORE' | 'ONGOING' | 'CLOSED';
  startDate: string;
  endDate: string;
  content: string;
  imageUrl: string;
  isApplied: boolean;
}
