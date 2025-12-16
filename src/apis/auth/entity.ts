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
}
