export type InquiryType = 'UNIVERSITY_NOT_FOUND' | 'DUPLICATE_STUDENT' | 'PROFILE_MODIFY';

export interface InquiryRequest {
  type: InquiryType;
  content: string;
}
