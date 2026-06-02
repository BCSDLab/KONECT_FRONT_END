interface UniversityLabelSource {
  name: string;
  campusName?: string;
}

const MAIN_CAMPUS_NAME = '본교';

export function getUniversityLabel(university: UniversityLabelSource) {
  const campusName = university.campusName?.trim();

  if (!campusName || campusName === MAIN_CAMPUS_NAME) return university.name;

  return `${university.name} ${campusName}`;
}
