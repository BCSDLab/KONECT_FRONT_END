export type UploadTarget = 'CLUB' | 'BANK' | 'COUNCIL' | 'USER';

export interface UploadImageResponse {
  key: string;
  fileUrl: string;
}
