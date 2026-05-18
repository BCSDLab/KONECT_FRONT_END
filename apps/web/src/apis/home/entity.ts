export type Region = 'SEOUL' | 'GYEONGGI' | 'CHUNGCHEONG' | 'JEOLLA' | 'GYEONGSANG' | 'GANGWON' | 'JEJU' | 'UNKNOWN';

export interface HomeRequestParams {
  query?: string;
  region?: Region;
}

export interface University {
  id: number;
  name: string;
  campusName: string;
  region: Region;
  regionName: string;
  imageUrl: string;
  clubCount: number;
}

export interface HomeResponse {
  totalUniversityCount: number;
  universities: University[];
}
