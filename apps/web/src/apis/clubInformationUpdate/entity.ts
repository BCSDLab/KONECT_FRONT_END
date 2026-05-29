import type { ClubCategory } from '@/apis/common/club';

export interface ClubInformationUpdateRequest {
  universityName: string;
  clubName: string;
  clubCategory: ClubCategory;
  clubTopic: string;
  clubEmoji: string;
  shortDescription: string;
  fullIntroduction: string;
  imageUrls: string[];
}

export interface SubmitClubInformationUpdateRequestParams {
  clubId: number;
  body: ClubInformationUpdateRequest;
}
