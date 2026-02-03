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
  type ClubProfileRequest,
  type ManagedClubResponse,
  type Bank,
  type ClubFeeRequest,
  type PositionsResponse,
  type TransferPresidentRequest,
  type AddMemberRequest,
  type ChangeVicePresidentRequest,
  type ChangeMemberPositionRequest,
  type CreatePositionRequest,
  type RenamePositionRequest,
} from './entity';

export type { Bank, ClubFeeRequest };

export const getClubs = async (params: ClubRequestParams) => {
  const response = await apiClient.get<ClubResponse, ClubRequestParams>('clubs', { params, requiresAuth: true });
  return response;
};

export const getJoinedClubs = async () => {
  const response = await apiClient.get<JoinClubResponse>('clubs/joined', { requiresAuth: true });
  return response;
};

export const getClubDetail = async (clubId: number) => {
  const response = await apiClient.get<ClubDetailResponse>(`clubs/${clubId}`, { requiresAuth: true });
  return response;
};

export const getClubMembers = async (clubId: number) => {
  const response = await apiClient.get<ClubMembersResponse>(`clubs/${clubId}/members`, { requiresAuth: true });
  return response;
};

export const getClubQuestions = async (clubId: number) => {
  const response = await apiClient.get<ClubQuestionsResponse>(`clubs/${clubId}/questions`, { requiresAuth: true });
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
  const response = await apiClient.get<ClubApplyResponse>(`clubs/${clubId}/fee`, { requiresAuth: true });
  return response;
};

export const getClubRecruitment = async (clubId: number) => {
  const response = await apiClient.get<ClubRecruitment>(`clubs/${clubId}/recruitments`, { requiresAuth: true });
  return response;
};

export const getAppliedClubs = async () => {
  const response = await apiClient.get<AppliedClubResponse>('clubs/applied', { requiresAuth: true });
  return response;
};

export const getManagedClubs = async () => {
  const response = await apiClient.get<JoinClubResponse>('clubs/managed', { requiresAuth: true });
  return response;
};

export const getManagedClubApplications = async (clubId: number) => {
  const response = await apiClient.get<ClubApplicationsResponse>(`clubs/${clubId}/applications`, {
    requiresAuth: true,
  });
  return response;
};

export const getManagedClubApplicationDetail = async (clubId: number, applicationId: number) => {
  const response = await apiClient.get<ClubApplicationDetailResponse>(`clubs/${clubId}/applications/${applicationId}`, {
    requiresAuth: true,
  });
  return response;
};

export const putClubRecruitment = async (clubId: number, recruitmentData: ClubRecruitmentRequest) => {
  const response = await apiClient.put<void>(`clubs/${clubId}/recruitments`, {
    body: recruitmentData,
    requiresAuth: true,
  });
  return response;
};

export const putClubQuestions = async (clubId: number, questionsData: ClubQuestionsRequest) => {
  const response = await apiClient.put<ClubQuestionsResponse>(`clubs/${clubId}/questions`, {
    body: questionsData,
    requiresAuth: true,
  });
  return response;
};

export const postClubApplicationApprove = async (clubId: number, applicationId: number) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/applications/${applicationId}/approve`, {
    requiresAuth: true,
  });
  return response;
};

export const postClubApplicationReject = async (clubId: number, applicationId: number) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/applications/${applicationId}/reject`, {
    requiresAuth: true,
  });
  return response;
};

export const getManagedClub = async (clubId: number) => {
  const response = await apiClient.get<ManagedClubResponse>(`clubs/managed/${clubId}`, { requiresAuth: true });
  return response;
};

export const putClubProfile = async (clubId: number, data: ClubProfileRequest) => {
  const response = await apiClient.put<void>(`clubs/${clubId}/profile`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const getBanks = async () => {
  const response = await apiClient.get<{ banks: Bank[] }>('banks', { requiresAuth: true });
  return response.banks;
};

export const putClubFee = async (clubId: number, data: ClubFeeRequest) => {
  const response = await apiClient.put<void>(`clubs/${clubId}/fee`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

//========================== Member & Position APIs =========================//

export const getClubPositions = async (clubId: number) => {
  const response = await apiClient.get<PositionsResponse>(`clubs/${clubId}/positions`, { requiresAuth: true });
  return response;
};

export const getManagedClubMembers = async (clubId: number) => {
  const response = await apiClient.get<ClubMembersResponse>(`clubs/${clubId}/members`, { requiresAuth: true });
  return response;
};

export const postTransferPresident = async (clubId: number, data: TransferPresidentRequest) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/president/transfer`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const postAddMember = async (clubId: number, data: AddMemberRequest) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/members`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const patchVicePresident = async (clubId: number, data: ChangeVicePresidentRequest) => {
  const response = await apiClient.patch<void>(`clubs/${clubId}/vice-president`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const patchMemberPosition = async (clubId: number, memberId: number, data: ChangeMemberPositionRequest) => {
  const response = await apiClient.patch<void>(`clubs/${clubId}/members/${memberId}/position`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const deleteMember = async (clubId: number, memberId: number) => {
  const response = await apiClient.delete<void>(`clubs/${clubId}/members/${memberId}`, { requiresAuth: true });
  return response;
};

export const postCreatePosition = async (clubId: number, data: CreatePositionRequest) => {
  const response = await apiClient.post<void>(`clubs/${clubId}/positions`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const deletePosition = async (clubId: number, positionId: number) => {
  const response = await apiClient.delete<void>(`clubs/${clubId}/positions/${positionId}`, { requiresAuth: true });
  return response;
};

export const patchRenamePosition = async (clubId: number, positionId: number, data: RenamePositionRequest) => {
  const response = await apiClient.patch<void>(`clubs/${clubId}/positions/${positionId}`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};
