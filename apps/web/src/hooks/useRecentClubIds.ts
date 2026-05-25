import { useEffect, useState } from 'react';

const RECENT_CLUB_IDS_STORAGE_KEY = 'konect:web:recent-club-ids:v1';
const RECENT_CLUB_IDS_STORAGE_VERSION = 1;
const RECENT_CLUB_IDS_CHANGE_EVENT = 'konect:recent-club-ids-change';
const MAX_RECENT_CLUB_COUNT = 4;

interface RecentClubIdsStorage {
  version: typeof RECENT_CLUB_IDS_STORAGE_VERSION;
  clubIds: number[];
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function sanitizeClubIds(value: unknown) {
  if (!Array.isArray(value)) return [];

  const seen = new Set<number>();
  const clubIds: number[] = [];
  const rawClubIds: unknown[] = value;

  for (const clubId of rawClubIds) {
    if (typeof clubId !== 'number') continue;
    if (!Number.isInteger(clubId) || clubId <= 0 || seen.has(clubId)) continue;

    seen.add(clubId);
    clubIds.push(clubId);

    if (clubIds.length >= MAX_RECENT_CLUB_COUNT) break;
  }

  return clubIds;
}

export function getRecentClubIds() {
  if (!canUseLocalStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(RECENT_CLUB_IDS_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue: unknown = JSON.parse(rawValue);

    if (Array.isArray(parsedValue)) {
      return sanitizeClubIds(parsedValue);
    }

    if (
      parsedValue &&
      typeof parsedValue === 'object' &&
      'version' in parsedValue &&
      'clubIds' in parsedValue &&
      parsedValue.version === RECENT_CLUB_IDS_STORAGE_VERSION
    ) {
      return sanitizeClubIds(parsedValue.clubIds);
    }
  } catch {
    return [];
  }

  return [];
}

function setRecentClubIds(clubIds: number[]) {
  if (!canUseLocalStorage()) return;

  const nextValue: RecentClubIdsStorage = {
    version: RECENT_CLUB_IDS_STORAGE_VERSION,
    clubIds: sanitizeClubIds(clubIds),
  };

  try {
    window.localStorage.setItem(RECENT_CLUB_IDS_STORAGE_KEY, JSON.stringify(nextValue));
    window.dispatchEvent(new Event(RECENT_CLUB_IDS_CHANGE_EVENT));
  } catch {
    return;
  }
}

export function addRecentClubId(clubId: number) {
  if (!Number.isInteger(clubId) || clubId <= 0) return;

  const previousClubIds = getRecentClubIds();
  const nextClubIds = [clubId, ...previousClubIds.filter((previousClubId) => previousClubId !== clubId)];
  setRecentClubIds(nextClubIds);
}

export function useRecentClubIds() {
  const [clubIds, setClubIds] = useState(getRecentClubIds);

  useEffect(() => {
    if (!canUseLocalStorage()) return;

    const updateClubIds = () => {
      setClubIds(getRecentClubIds());
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === RECENT_CLUB_IDS_STORAGE_KEY) {
        updateClubIds();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(RECENT_CLUB_IDS_CHANGE_EVENT, updateClubIds);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(RECENT_CLUB_IDS_CHANGE_EVENT, updateClubIds);
    };
  }, []);

  return clubIds;
}
