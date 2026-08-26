import type { PexelsPhoto, PexelsVideo } from "@/lib/pexels";

const PHOTOS_KEY = "galleryz-favorites";
const VIDEOS_KEY = "galleryz-favorites-videos";
export const MAX_FAVORITES = 30;

export type ToggleResult = {
  favorited: boolean;
  limitReached: boolean;
};

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  } catch {
    return [];
  }
}

function toggle<T extends { id: number }>(key: string, item: T): ToggleResult {
  const items = read<T>(key);
  const exists = items.some((i) => i.id === item.id);

  if (!exists && items.length >= MAX_FAVORITES) {
    return { favorited: false, limitReached: true };
  }

  const next = exists ? items.filter((i) => i.id !== item.id) : [...items, item];
  localStorage.setItem(key, JSON.stringify(next));
  return { favorited: !exists, limitReached: false };
}

export function getFavorites(): PexelsPhoto[] {
  return read<PexelsPhoto>(PHOTOS_KEY);
}

export function isFavorite(id: number): boolean {
  return getFavorites().some((p) => p.id === id);
}

export function toggleFavorite(photo: PexelsPhoto): ToggleResult {
  return toggle(PHOTOS_KEY, photo);
}

export function getFavoriteVideos(): PexelsVideo[] {
  return read<PexelsVideo>(VIDEOS_KEY);
}

export function isFavoriteVideo(id: number): boolean {
  return getFavoriteVideos().some((v) => v.id === id);
}

export function toggleFavoriteVideo(video: PexelsVideo): ToggleResult {
  return toggle(VIDEOS_KEY, video);
}
