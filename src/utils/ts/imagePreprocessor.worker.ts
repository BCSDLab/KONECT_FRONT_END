const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.9;
const WEBP_MIME_TYPE = 'image/webp';

interface ImagePreprocessRequest {
  id: number;
  file: File;
  maxDimension?: number;
  quality?: number;
}

interface ImagePreprocessResponse {
  durationMs: number;
  file: File;
  id: number;
  originalHeight: number;
  originalWidth: number;
  outputHeight: number;
  outputMimeType: string;
  outputWidth: number;
  skipped: boolean;
  workerUsed: boolean;
}

function getOutputMimeType() {
  return WEBP_MIME_TYPE;
}

function getOutputFileName(fileName: string, mimeType: string) {
  const nextExtension = mimeType === WEBP_MIME_TYPE ? 'webp' : 'jpg';
  const sanitizedFileName = fileName.replace(/\.[^.]+$/, '');

  return `${sanitizedFileName}.${nextExtension}`;
}

function getTargetDimensions(width: number, height: number, maxDimension: number) {
  const largestDimension = Math.max(width, height);

  if (largestDimension <= maxDimension) {
    return { height, width };
  }

  const scale = maxDimension / largestDimension;

  return {
    height: Math.max(1, Math.round(height * scale)),
    width: Math.max(1, Math.round(width * scale)),
  };
}

self.onmessage = async (event: MessageEvent<ImagePreprocessRequest>) => {
  const startedAt = performance.now();
  const { file, id } = event.data;
  const maxDimension = event.data.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = event.data.quality ?? DEFAULT_QUALITY;

  try {
    const bitmap = await createImageBitmap(file);
    const originalWidth = bitmap.width;
    const originalHeight = bitmap.height;
    const { width: outputWidth, height: outputHeight } = getTargetDimensions(
      originalWidth,
      originalHeight,
      maxDimension
    );
    const outputMimeType = getOutputMimeType();

    if (outputWidth === originalWidth && outputHeight === originalHeight && file.type === outputMimeType) {
      bitmap.close();
      const response: ImagePreprocessResponse = {
        durationMs: Math.round(performance.now() - startedAt),
        file,
        id,
        originalHeight,
        originalWidth,
        outputHeight,
        outputMimeType: file.type || outputMimeType,
        outputWidth,
        skipped: true,
        workerUsed: true,
      };
      self.postMessage(response);
      return;
    }

    const canvas = new OffscreenCanvas(outputWidth, outputHeight);
    const context = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true,
    });

    if (!context) {
      bitmap.close();
      throw new Error('2D canvas context를 생성하지 못했습니다.');
    }

    context.drawImage(bitmap, 0, 0, outputWidth, outputHeight);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      quality,
      type: outputMimeType,
    });

    const nextFile = new File([blob], getOutputFileName(file.name, blob.type || outputMimeType), {
      lastModified: Date.now(),
      type: blob.type || outputMimeType,
    });

    const response: ImagePreprocessResponse = {
      durationMs: Math.round(performance.now() - startedAt),
      file: nextFile,
      id,
      originalHeight,
      originalWidth,
      outputHeight,
      outputMimeType: nextFile.type || outputMimeType,
      outputWidth,
      skipped: false,
      workerUsed: true,
    };

    self.postMessage(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '이미지 전처리에 실패했습니다.';

    self.postMessage({
      errorMessage,
      id,
    });
  }
};
