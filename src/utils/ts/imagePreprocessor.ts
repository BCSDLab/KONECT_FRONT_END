const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.9;
const JPEG_MIME_TYPE = 'image/jpeg';
const PNG_MIME_TYPE = 'image/png';
const WEBP_MIME_TYPE = 'image/webp';
const SUPPORTED_IMAGE_MIME_TYPES = new Set([JPEG_MIME_TYPE, PNG_MIME_TYPE, WEBP_MIME_TYPE]);

interface ImagePreprocessRequest {
  id: number;
  file: File;
  maxDimension?: number;
  quality?: number;
}

interface ImagePreprocessResponse {
  file: File;
  id: number;
}

interface ImagePreprocessErrorResponse {
  errorMessage: string;
  id: number;
}

interface PrepareImageFileOptions {
  maxDimension?: number;
  quality?: number;
}

interface PendingRequestHandlers {
  reject: (error: unknown) => void;
  resolve: (value: ImagePreprocessResponse | null) => void;
}

let imagePreprocessWorker: Worker | null = null;
let messageId = 0;
const pendingImagePreprocessRequests = new Map<number, PendingRequestHandlers>();

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

function resetImagePreprocessWorker() {
  imagePreprocessWorker?.terminate();
  imagePreprocessWorker = null;
}

function getWorker() {
  if (typeof Worker === 'undefined') {
    return null;
  }

  if (!imagePreprocessWorker) {
    try {
      const worker = new Worker(new URL('./imagePreprocessor.worker.ts', import.meta.url), {
        type: 'module',
      });

      worker.onmessage = (event: MessageEvent<ImagePreprocessResponse | ImagePreprocessErrorResponse>) => {
        const currentRequest = pendingImagePreprocessRequests.get(event.data.id);

        if (!currentRequest) {
          return;
        }

        pendingImagePreprocessRequests.delete(event.data.id);

        if ('errorMessage' in event.data) {
          currentRequest.reject(new Error(event.data.errorMessage));
          return;
        }

        currentRequest.resolve(event.data);
      };
      worker.onerror = (event) => {
        pendingImagePreprocessRequests.forEach(({ reject }) => {
          reject(new Error(event.message || '이미지 전처리 worker에서 오류가 발생했습니다.'));
        });
        pendingImagePreprocessRequests.clear();
        resetImagePreprocessWorker();
      };

      imagePreprocessWorker = worker;
    } catch {
      resetImagePreprocessWorker();
      return null;
    }
  }

  return imagePreprocessWorker;
}

async function runWorkerPreprocess(file: File, options: PrepareImageFileOptions) {
  let worker: Worker | null;

  try {
    worker = getWorker();
  } catch {
    resetImagePreprocessWorker();
    return null;
  }

  if (!worker || typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined') {
    return null;
  }

  const id = messageId++;
  const requestPayload: ImagePreprocessRequest = {
    file,
    id,
    maxDimension: options.maxDimension ?? DEFAULT_MAX_DIMENSION,
    quality: options.quality ?? DEFAULT_QUALITY,
  };

  return new Promise<ImagePreprocessResponse | null>((resolve, reject) => {
    try {
      pendingImagePreprocessRequests.set(id, { reject, resolve });
      worker.postMessage(requestPayload);
    } catch {
      pendingImagePreprocessRequests.delete(id);
      resetImagePreprocessWorker();
      resolve(null);
    }
  });
}

async function loadImageElement(file: File) {
  const previewUrl = URL.createObjectURL(file);

  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const imageElement = new Image();
      imageElement.onload = () => resolve(imageElement);
      imageElement.onerror = () => reject(new Error('이미지 로딩에 실패했습니다.'));
      imageElement.src = previewUrl;
    });
  } finally {
    URL.revokeObjectURL(previewUrl);
  }
}

async function convertCanvasToBlob(
  canvasElement: HTMLCanvasElement,
  outputMimeType: string,
  quality: number | undefined
) {
  return new Promise<Blob>((resolve, reject) => {
    canvasElement.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지 Blob 생성에 실패했습니다.'));
          return;
        }

        resolve(blob);
      },
      outputMimeType,
      quality
    );
  });
}

async function runMainThreadPreprocess(file: File, options: PrepareImageFileOptions) {
  const imageElement = await loadImageElement(file);
  const originalWidth = imageElement.naturalWidth || imageElement.width;
  const originalHeight = imageElement.naturalHeight || imageElement.height;
  const outputMimeType = getOutputMimeType();
  const { width: outputWidth, height: outputHeight } = getTargetDimensions(
    originalWidth,
    originalHeight,
    options.maxDimension ?? DEFAULT_MAX_DIMENSION
  );

  if (outputWidth === originalWidth && outputHeight === originalHeight && file.type === outputMimeType) {
    return file;
  }

  const canvasElement = document.createElement('canvas');
  canvasElement.width = outputWidth;
  canvasElement.height = outputHeight;
  const context = canvasElement.getContext('2d', {
    alpha: true,
  });

  if (!context) {
    throw new Error('2D canvas context를 생성하지 못했습니다.');
  }

  context.drawImage(imageElement, 0, 0, outputWidth, outputHeight);

  const blob = await convertCanvasToBlob(canvasElement, outputMimeType, options.quality ?? DEFAULT_QUALITY);

  return new File([blob], getOutputFileName(file.name, blob.type || outputMimeType), {
    lastModified: Date.now(),
    type: blob.type || outputMimeType,
  });
}

export async function prepareImageFile(file: File, options: PrepareImageFileOptions = {}) {
  if (!SUPPORTED_IMAGE_MIME_TYPES.has(file.type)) {
    return file;
  }

  try {
    let workerResponse: ImagePreprocessResponse | null = null;

    try {
      workerResponse = await runWorkerPreprocess(file, options);
    } catch {
      resetImagePreprocessWorker();
    }

    if (workerResponse) {
      return workerResponse.file;
    }

    return await runMainThreadPreprocess(file, options);
  } catch {
    return file;
  }
}
