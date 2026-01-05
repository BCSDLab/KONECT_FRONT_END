export interface SignupRequest {
  name: string;
  universityId: string;
  studentNumber: number;
  isMarketingAgreement: boolean;
}

export interface MyInfoResponse {
  name: string;
  universityName: string;
  studentNumber: number;
  phoneNumber: string;
  email: string;
  imageUrl: string;
  joinedClubCount: number;
  studyTime: string;
  unreadCouncilNoticeCount: number;
}

export interface ModifyMyInfoRequest {
  name?: string;
  studentNumber?: number;
  phoneNumber?: string;
}
