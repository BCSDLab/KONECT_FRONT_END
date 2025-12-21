import { apiClient } from '../client';
import {
  type ClubApplyResponse,
  type ClubApplyRequest,
  type ClubDetailResponse,
  type ClubMembersResponse,
  type ClubQuestionsResponse,
  type ClubRequestParams,
  type ClubResponse,
  type JoinClubResponse,
  type ClubRecruitment,
} from './entity';

export const getClubs = async (params: ClubRequestParams) => {
  const response = await apiClient.get<ClubResponse, ClubRequestParams>('clubs', { params });
  return response;
};

export const getJoinedClubs = async () => {
  const response = await apiClient.get<JoinClubResponse>('clubs/joined');
  return response;
};

export const getClubDetail = async (clubId: number) => {
  const response = await apiClient.get<ClubDetailResponse>(`clubs/${clubId}`);
  return response;
};

export const getClubMembers = async (clubId: number) => {
  const response = await apiClient.get<ClubMembersResponse>(`clubs/${clubId}/members`);
  return response;
};

export const getClubQuestions = async (clubId: number) => {
  const response = await apiClient.get<ClubQuestionsResponse>(`clubs/${clubId}/questions`);
  return response;
};

export const applyClub = async (clubId: number, answers: ClubApplyRequest) => {
  const response = await apiClient.post<ClubApplyResponse>(`clubs/${clubId}/apply`, {
    body: answers,
    requiresAuth: true,
  });
  return response;
};

export const getClubFee = async (clubId: number) => {
  const response = await apiClient.get<ClubApplyResponse>(`clubs/${clubId}/fee`);
  return response;
};

export const getClubRecruitment = async (clubId: number) => {
  const response = await apiClient.get<ClubRecruitment>(`clubs/${clubId}/recruitments`);
  return response;
};
