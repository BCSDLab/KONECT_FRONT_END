import type { University } from '@/apis/home/entity';

import type { LocalMediaItem } from './components';

export function createLocalMediaItem(file: File): LocalMediaItem {
  return {
    file,
    id: `${file.name}-${file.lastModified}-${Date.now()}-${Math.random()}`,
    previewUrl: URL.createObjectURL(file),
  };
}

export function getUniversityLabel(university: University) {
  return university.campusName ? `${university.name} ${university.campusName}` : university.name;
}
