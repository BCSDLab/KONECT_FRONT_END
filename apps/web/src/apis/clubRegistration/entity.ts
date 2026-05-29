import type { ClubInformationUpdateRequest } from '@/apis/clubInformationUpdate/entity';

export type ClubRegistrationRequest = ClubInformationUpdateRequest;

export interface SubmitClubRegistrationRequestParams {
  body: ClubRegistrationRequest;
}
