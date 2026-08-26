const PEXELS_API_URL = "https://api.pexels.com/v1";
const PEXELS_VIDEO_API_URL = "https://api.pexels.com/videos";

export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  avg_color: string;
  alt: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
};

export type PexelsVideo = {
  id: number;
  width: number;
  height: number;
  url: string;
  duration: number;
  image: string;
  user: {
    name: string;
    url: string;
  };
  video_files: {
    id: number;
    quality: string;
    width: number;
    height: number;
    link: string;
  }[];
};

export type PexelsCollection = {
  id: string;
  title: string;
  description: string | null;
  private: boolean;
  media_count: number;
  photos_count: number;
  videos_count: number;
};

type CuratedResponse = {
  photos: PexelsPhoto[];
};

export type FeaturedCollectionsResponse = {
  collections: PexelsCollection[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
};

export type PexelsCollectionMedia =
  | ({ type: "Photo" } & PexelsPhoto)
  | ({ type: "Video" } & PexelsVideo);

export type CollectionMediaResponse = {
  id: string;
  media: PexelsCollectionMedia[];
  page: number;
  per_page: number;
  total_results: number;
  next_page?: string;
  prev_page?: string;
};

type PopularVideosResponse = {
  videos: PexelsVideo[];
};

export type PhotoSearchParams = {
  query: string;
  page?: number;
  per_page?: number;
  orientation?: "landscape" | "portrait" | "square";
  size?: "large" | "medium" | "small";
  color?: string;
  locale?: string;
};

export type VideoSearchParams = {
  query: string;
  page?: number;
  per_page?: number;
  orientation?: "landscape" | "portrait" | "square";
  size?: "large" | "medium" | "small";
  locale?: string;
};

export async function getCuratedPhotos(
  page = 1,
  perPage = 30,
): Promise<PexelsPhoto[]> {
  const res = await fetch(
    `${PEXELS_API_URL}/curated?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: CuratedResponse = await res.json();
  return data.photos;
}

export async function getPopularVideos(
  page = 1,
  perPage = 30,
): Promise<PexelsVideo[]> {
  const res = await fetch(
    `${PEXELS_VIDEO_API_URL}/popular?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: PopularVideosResponse = await res.json();
  return data.videos;
}

export async function getFeaturedCollections(
  page = 1,
  perPage = 1,
): Promise<FeaturedCollectionsResponse> {
  const res = await fetch(
    `${PEXELS_API_URL}/collections/featured?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  return res.json();
}

export async function getCollectionMedia(
  id: string,
  page = 1,
  perPage = 1,
  sort: "asc" | "desc" = "desc",
): Promise<CollectionMediaResponse> {
  const res = await fetch(
    `${PEXELS_API_URL}/collections/${id}?page=${page}&per_page=${perPage}&sort=${sort}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  return res.json();
}

export async function searchPhotos(
  params: PhotoSearchParams,
): Promise<PexelsPhoto[]> {
  const search = new URLSearchParams();
  search.set("query", params.query);
  search.set("page", String(params.page ?? 1));
  search.set("per_page", String(params.per_page ?? 30));
  if (params.orientation) search.set("orientation", params.orientation);
  if (params.size) search.set("size", params.size);
  if (params.color) search.set("color", params.color);
  if (params.locale) search.set("locale", params.locale);

  const res = await fetch(`${PEXELS_API_URL}/search?${search.toString()}`, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: CuratedResponse = await res.json();
  return data.photos;
}

export async function searchVideos(
  params: VideoSearchParams,
): Promise<PexelsVideo[]> {
  const search = new URLSearchParams();
  search.set("query", params.query);
  search.set("page", String(params.page ?? 1));
  search.set("per_page", String(params.per_page ?? 30));
  if (params.orientation) search.set("orientation", params.orientation);
  if (params.size) search.set("size", params.size);
  if (params.locale) search.set("locale", params.locale);

  const res = await fetch(
    `${PEXELS_VIDEO_API_URL}/search?${search.toString()}`,
    {
      headers: {
        Authorization: process.env.PEXELS_API_KEY!,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status}`);
  }

  const data: PopularVideosResponse = await res.json();
  return data.videos;
}
