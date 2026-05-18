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
  email: string;
  imageUrl: string;
  joinedClubCount: number;
  studyTime: string;
  unreadCouncilNoticeCount: number;
  isClubManager: boolean;
  role: string;
}

export interface ModifyMyInfoRequest {
  name?: string;
  studentNumber?: string;
  phoneNumber?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export const OAUTH_PROVIDERS = ['GOOGLE', 'KAKAO', 'NAVER', 'APPLE'] as const;

export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];

export interface OAuthLinkProvider {
  provider: OAuthProvider;
  linked: boolean;
}

export interface OAuthLinksResponse {
  providers: OAuthLinkProvider[];
}
