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
  type ClubInfoRequest,
  type ManagedClubResponse,
  type Bank,
  type ClubFeeRequest,
  type ClubFeeResponse,
  type TransferPresidentRequest,
  type TransferPresidentResponse,
  type ChangeVicePresidentRequest,
  type ChangeVicePresidentResponse,
  type ChangeMemberPositionRequest,
  type ChangeMemberPositionResponse,
  type AddPreMemberRequest,
  type AddPreMemberResponse,
  type PositionType,
  type PreMembersList,
} from './entity';

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

export const getClubMembers = async (clubId: number, position?: PositionType) => {
  const response = await apiClient.get<ClubMembersResponse, { position: PositionType }>(`clubs/${clubId}/members`, {
    params: position ? { position } : undefined,
    requiresAuth: true,
  });
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
  const response = await apiClient.get<ClubFeeResponse>(`clubs/${clubId}/fee`, { requiresAuth: true });
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

export const putClubInfo = async (clubId: number, data: ClubInfoRequest) => {
  const response = await apiClient.put<void>(`clubs/${clubId}/info`, {
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
  const response = await apiClient.put<ClubFeeResponse>(`clubs/${clubId}/fee`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

//========================== Member Management APIs =========================//

export const postTransferPresident = async (clubId: number, data: TransferPresidentRequest) => {
  const response = await apiClient.post<TransferPresidentResponse>(`clubs/${clubId}/president/transfer`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const patchVicePresident = async (clubId: number, data: ChangeVicePresidentRequest) => {
  const response = await apiClient.patch<ChangeVicePresidentResponse>(`clubs/${clubId}/vice-president`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const patchMemberPosition = async (clubId: number, userId: number, data: ChangeMemberPositionRequest) => {
  const response = await apiClient.patch<ChangeMemberPositionResponse>(`clubs/${clubId}/members/${userId}/position`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const deleteMember = async (clubId: number, userId: number) => {
  const response = await apiClient.delete<void>(`clubs/${clubId}/members/${userId}`, { requiresAuth: true });
  return response;
};

export const postAddPreMember = async (clubId: number, data: AddPreMemberRequest) => {
  const response = await apiClient.post<AddPreMemberResponse>(`clubs/${clubId}/pre-members`, {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const getPreMembers = async (clubId: number) => {
  const response = await apiClient.get<PreMembersList>(`clubs/${clubId}/pre-members`, { requiresAuth: true });
  return response;
};

export const deletePreMember = async (clubId: number, preMemberId: number) => {
  const response = await apiClient.delete<void>(`clubs/${clubId}/pre-members/${preMemberId}`, { requiresAuth: true });
  return response;
};
