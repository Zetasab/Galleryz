"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PexelsPhoto, PexelsVideo } from "@/lib/pexels";
import { ContentTabs, type ContentTab } from "@/components/content-tabs";
import { Gallery } from "@/components/gallery";
import { VideoGallery } from "@/components/video-gallery";
import { Search } from "lucide-react";

export function GallerySection({
  initialPhotos,
  initialVideos,
}: {
  initialPhotos: PexelsPhoto[];
  initialVideos: PexelsVideo[];
}) {
  const [tab, setTab] = useState<ContentTab>("photos");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "videos") setTab("videos");
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          href="/galeria"
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <Search className="h-3.5 w-3.5" />
          Buscar imágenes
        </Link>

        <ContentTabs active={tab} onChange={setTab} noMargin />

        <Link
          href="/videoteca"
          className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <Search className="h-3.5 w-3.5" />
          Buscar videos
        </Link>
      </div>
      {tab === "photos" ? (
        <Gallery key="photos" initialPhotos={initialPhotos} />
      ) : (
        <VideoGallery key="videos" initialVideos={initialVideos} />
      )}
    </div>
  );
}
