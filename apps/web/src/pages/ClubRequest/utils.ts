import type { University } from '@/apis/home/entity';
import { getUniversityLabel as getFormattedUniversityLabel } from '@/utils/universityLabel';

import type { LocalMediaItem } from './components';

export function createLocalMediaItem(file: File): LocalMediaItem {
  return {
    file,
    id: `${file.name}-${file.lastModified}-${Date.now()}-${Math.random()}`,
    previewUrl: URL.createObjectURL(file),
  };
}

export function getUniversityLabel(university: University) {
  return getFormattedUniversityLabel(university);
}
