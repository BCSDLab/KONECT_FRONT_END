import type { ImageUploadItem } from '../types';

type UploadImageFile = (file: File) => Promise<{ fileUrl: string }>;

export async function resolveImageUploadItemUrl(image: ImageUploadItem | undefined, uploadImage: UploadImageFile) {
  if (!image) return '';
  if (image.kind === 'existing') return image.previewUrl;

  const { fileUrl } = await uploadImage(image.file);
  return fileUrl;
}

export async function resolveImageUploadItemUrls(images: ImageUploadItem[], uploadImage: UploadImageFile) {
  return Promise.all(images.map((image) => resolveImageUploadItemUrl(image, uploadImage)));
}
