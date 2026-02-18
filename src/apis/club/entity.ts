import type { PaginationParams, PaginationResponse } from '../common/pagination';

export interface Club {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  description: string;
  status: 'BEFORE' | 'ONGOING' | 'CLOSED';
  isPendingApproval: boolean;
  isAlwaysRecruiting: boolean;
  applicationDeadline: string;
  tags: string[];
}

export interface ClubResponse extends PaginationResponse {
  clubs: Club[];
}

export interface ClubRequestParams extends PaginationParams {
  isRecruiting: boolean;
  query?: string;
}

export interface JoinClub {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  position: '일반회원' | '운영진' | '회장';
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
  presidentUserId: number;
  presidentName: string;
  isMember: boolean;
  isApplied: boolean;
}

interface Recruitment {
  status: 'BEFORE' | 'ONGOING' | 'CLOSED';
  startDate?: string;
  endDate?: string;
}

export type PositionType = 'PRESIDENT' | 'VICE_PRESIDENT' | 'MANAGER' | 'MEMBER';

export interface ClubMember {
  userId: number;
  name: string;
  imageUrl: string;
  studentNumber: string;
  position: PositionType;
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
  feePaymentImageUrl?: string;
}

export interface ClubApplyResponse {
  bankId?: number;
  amount?: number | string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  deadLine?: string;
}

export interface ClubRecruitmentImage {
  url: string;
}

export interface ClubRecruitment {
  id: number;
  clubId: number;
  status: 'BEFORE' | 'ONGOING' | 'CLOSED';
  startDate: string;
  endDate: string;
  content: string;
  images: ClubRecruitmentImage[];
  isFeeRequired: boolean;
  isApplied: boolean;
}

export interface AppliedClub {
  id: number;
  name: string;
  imageUrl: string;
  categoryName: string;
  appliedAt: string;
}

export interface AppliedClubResponse {
  appliedClubs: AppliedClub[];
}

//========================== Club Manager Entities =========================//
interface Application {
  id: number;
  studentNumber: number;
  name: string;
  imageUrl: string;
  appliedAt: string;
}

export interface ClubApplicationsResponse {
  applications: Application[];
}

interface ApplicationAnswer {
  questionId: number;
  question: string;
  isRequired: boolean;
  answer: string;
}

export interface ClubApplicationDetailResponse {
  applicationId: number;
  studentNumber: number;
  name: string;
  imageUrl: string;
  appliedAt: string;
  feePaymentImageUrl?: string;
  answers: ApplicationAnswer[];
}

interface RecruitmentImage {
  url: string;
}

type BaseRecruitment = {
  content: string;
  images: RecruitmentImage[];
  isFeeRequired: boolean;
};

export type ClubRecruitmentRequest =
  | (BaseRecruitment & {
      isAlwaysRecruiting: true;
      startDate?: never;
      endDate?: never;
    })
  | (BaseRecruitment & {
      isAlwaysRecruiting: false;
      startDate: string;
      endDate: string;
    });

export interface ClubQuestionRequest {
  questionId?: number;
  question: string;
  isRequired: boolean;
}

export interface ClubQuestionsRequest {
  questions: ClubQuestionRequest[];
}

export interface ManagedClubResponse {
  clubId: number;
  imageUrl: string;
  clubName: string;
  name: string;
  studentNumber: string;
  position: '회장' | '부회장' | '운영진';
}

export interface ClubInfoRequest {
  description: string;
  imageUrl: string;
  location: string;
  introduce: string;
}

export interface Bank {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ClubFeeRequest {
  bankId: number | null;
  amount: number | string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  deadLine: string;
}

//========================== Member Management Entities =========================//

export interface TransferPresidentRequest {
  newPresidentUserId: number;
}

export interface TransferPresidentResponse {
  changedMembers: ChangedMember[];
}

export interface ChangeVicePresidentRequest {
  vicePresidentUserId: number | null;
}

export interface ChangeVicePresidentResponse {
  changedMembers: ChangedMember[];
}

export interface ChangeMemberPositionRequest {
  position: 'MANAGER' | 'MEMBER';
}

export interface ChangeMemberPositionResponse {
  clubId: number;
  userId: number;
  userName: string;
  position: PositionType;
}

interface ChangedMember {
  clubId: number;
  userId: number;
  userName: string;
  position: PositionType;
}

export interface AddPreMemberRequest {
  studentNumber: string;
  name: string;
}

export interface AddPreMemberResponse {
  clubId: number;
  studentNumber: string;
  name: string;
}

export interface PreMember {
  preMemberId: number;
  studentNumber: string;
  name: string;
  clubPosition: 'MANAGER' | 'MEMBER';
}

export interface PreMembersList {
  preMembers: PreMember[];
}

export interface PreMemberDeleteRequest {
  clubId: number;
  preMemberId: number;
}
