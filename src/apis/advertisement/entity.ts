export interface Advertisement {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}

export interface AdvertisementsRequestParams {
  count?: number;
}

export interface AdvertisementsResponse {
  advertisements: Advertisement[];
}
