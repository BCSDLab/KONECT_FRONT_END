import { apiClient } from '../client';
import {
  type ClubApplyResponse,
  type ClubApplyRequest,
  type ClubDetailResponse,
  type ClubMembersResponse,
  type ClubQuestionsResponse,
  type ClubQuestionsRequest,
  type ClubRequestParams,
  type ClubResponse,
  type JoinClubResponse,
  type ClubRecruitment,
  type AppliedClubResponse,
  type ClubApplicationsResponse,
  type ClubApplicationDetailResponse,
  type ClubRecruitmentRequest,
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

export const getAppliedClubs = async () => {
  const response = await apiClient.get<AppliedClubResponse>('clubs/applied');
  return response;
};

export const getManagedClubs = async () => {
  const response = await apiClient.get<JoinClubResponse>('clubs/managed');
  return response;
};

export const getManagedClubApplications = async (clubId: number) => {
  const response = await apiClient.get<ClubApplicationsResponse>(`clubs/${clubId}/applications`);
  return response;
};

export const getManagedClubApplicationDetail = async (clubId: number, applicationId: number) => {
  const response = await apiClient.get<ClubApplicationDetailResponse>(`clubs/${clubId}/applications/${applicationId}`);
  return response;
};

export const postClubRecruitment = async (clubId: number, recruitmentData: ClubRecruitmentRequest) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/recruitments`, {
    body: recruitmentData,
  });
  return response;
};

export const putClubRecruitment = async (clubId: number, recruitmentData: ClubRecruitmentRequest) => {
  const response = await apiClient.put<void>(`clubs/${clubId}/recruitments`, {
    body: recruitmentData,
  });
  return response;
};

export const putClubQuestions = async (clubId: number, questionsData: ClubQuestionsRequest) => {
  const response = await apiClient.put<ClubQuestionsResponse>(`clubs/${clubId}/questions`, {
    body: questionsData,
  });
  return response;
};

export const postClubApplicationApprove = async (clubId: number, applicationId: number) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/applications/${applicationId}/approve`);
  return response;
};

export const postClubApplicationReject = async (clubId: number, applicationId: number) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/applications/${applicationId}/reject`);
  return response;
};
