export type ImageUploaderSelectionMode = 'single' | 'multiple';
export type ImageUploaderLayout = 'wide' | 'square';

interface ImageUploadItemBase {
  id: string;
  previewUrl: string;
}

export interface ExistingImageUploadItem extends ImageUploadItemBase {
  kind: 'existing';
}

export interface LocalImageUploadItem extends ImageUploadItemBase {
  file: File;
  kind: 'local';
}

export type ImageUploadItem = ExistingImageUploadItem | LocalImageUploadItem;
