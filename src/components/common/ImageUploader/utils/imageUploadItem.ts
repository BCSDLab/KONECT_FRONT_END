import type { ExistingImageUploadItem, ImageUploadItem, LocalImageUploadItem } from '../types';

export function createImageUploadItemId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function createExistingImageUploadItem(previewUrl: string): ExistingImageUploadItem {
  return {
    id: createImageUploadItemId(),
    kind: 'existing',
    previewUrl,
  };
}

export function createLocalImageUploadItem(file: File): LocalImageUploadItem {
  return {
    id: createImageUploadItemId(),
    file,
    kind: 'local',
    previewUrl: URL.createObjectURL(file),
  };
}

export function revokeImagePreviewUrl(image: ImageUploadItem) {
  if (image.kind === 'local' && image.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(image.previewUrl);
  }
}
