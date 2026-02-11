export type InquiryType = 'UNIVERSITY_NOT_FOUND' | 'DUPLICATE_STUDENT';

export interface InquiryRequest {
  type: InquiryType;
  content: string;
}
