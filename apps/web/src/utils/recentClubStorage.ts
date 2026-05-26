import { useEffect, useState } from 'react';

const RECENT_CLUB_IDS_STORAGE_KEY = 'konect:recent-club-ids';
const RECENT_CLUB_IDS_CHANGE_EVENT = 'konect:recent-club-ids-change';
const RECENT_CLUB_IDS_LIMIT = 4;

export function getRecentClubIds() {
  if (!canUseLocalStorage()) return [];

  try {
    const rawValue = window.localStorage.getItem(RECENT_CLUB_IDS_STORAGE_KEY);
    if (!rawValue) return [];

    const parsedValue: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsedValue)) return [];

    return normalizeClubIds(parsedValue);
  } catch {
    return [];
  }
}

export function saveRecentClubId(clubId: number) {
  if (!Number.isInteger(clubId) || clubId <= 0) return getRecentClubIds();

  const nextClubIds = [clubId, ...getRecentClubIds().filter((id) => id !== clubId)].slice(0, RECENT_CLUB_IDS_LIMIT);

  if (canUseLocalStorage()) {
    try {
      window.localStorage.setItem(RECENT_CLUB_IDS_STORAGE_KEY, JSON.stringify(nextClubIds));
      window.dispatchEvent(new Event(RECENT_CLUB_IDS_CHANGE_EVENT));
    } catch {
      return getRecentClubIds();
    }
  }

  return nextClubIds;
}

export function useRecentClubIds() {
  const [clubIds, setClubIds] = useState(getRecentClubIds);

  useEffect(() => {
    const handleRecentClubIdsChange = () => setClubIds(getRecentClubIds());
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === RECENT_CLUB_IDS_STORAGE_KEY) {
        handleRecentClubIdsChange();
      }
    };

    window.addEventListener(RECENT_CLUB_IDS_CHANGE_EVENT, handleRecentClubIdsChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(RECENT_CLUB_IDS_CHANGE_EVENT, handleRecentClubIdsChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return clubIds;
}

function normalizeClubIds(value: unknown[]) {
  const clubIds: number[] = [];

  value.forEach((item) => {
    const clubId = Number(item);

    if (Number.isInteger(clubId) && clubId > 0 && !clubIds.includes(clubId)) {
      clubIds.push(clubId);
    }
  });

  return clubIds.slice(0, RECENT_CLUB_IDS_LIMIT);
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && 'localStorage' in window;
}
