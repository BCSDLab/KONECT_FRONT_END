export interface SignupRequest {
  name: string;
  universityId: string;
  studentNumber: string;
  isMarketingAgreement: boolean;
}

export interface MyInfoResponse {
  name: string;
  universityName: string;
  studentNumber: string;
  phoneNumber: string;
  imageUrl: string;
  joinedClubCount: number;
  studyTime: string;
  unreadCouncilNoticeCount: number;
}

export interface ModifyMyInfoRequest {
  name?: string;
  studentNumber?: string;
  phoneNumber?: string;
}
