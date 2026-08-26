"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { PexelsPhoto, PexelsVideo } from "@/lib/pexels";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import {
  getFavorites,
  getFavoriteVideos,
  toggleFavorite,
  toggleFavoriteVideo,
} from "@/lib/favorites";
import { ContentTabs, type ContentTab } from "@/components/content-tabs";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Maximize,
  Palette,
  Play,
  User,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

function bestVideoFile(video: PexelsVideo) {
  return video.video_files.find((f) => f.quality === "hd") ?? video.video_files[0];
}

export function FavoritesView() {
  const [tab, setTab] = useState<ContentTab>("photos");
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setPhotos(getFavorites());
    setVideos(getFavoriteVideos());
  }, []);

  useEffect(() => {
    setSelectedIndex(null);
  }, [tab]);

  const items = tab === "photos" ? photos : videos;

  const showPrev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }, [items.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % items.length));
  }, [items.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, showPrev, showNext]);

  const removePhoto = (photo: PexelsPhoto) => {
    toggleFavorite(photo);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setSelectedIndex(null);
    toast.success("Eliminado de favoritos");
  };

  const removeVideo = (video: PexelsVideo) => {
    toggleFavoriteVideo(video);
    setVideos((prev) => prev.filter((v) => v.id !== video.id));
    setSelectedIndex(null);
    toast.success("Eliminado de favoritos");
  };

  const selectedPhoto = tab === "photos" && selectedIndex !== null ? photos[selectedIndex] : null;
  const selectedVideo = tab === "videos" && selectedIndex !== null ? videos[selectedIndex] : null;

  return (
    <div>
      <ContentTabs active={tab} onChange={setTab} />

      {items.length === 0 ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          {tab === "photos"
            ? "Todavía no has guardado ninguna foto como favorita."
            : "Todavía no has guardado ningún video como favorito."}
        </p>
      ) : tab === "photos" ? (
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              style={{ "--i": index } as CSSProperties}
              className="animate-card-in group relative mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-lg bg-zinc-100 text-left dark:bg-zinc-900"
            >
              <ImageWithSkeleton
                src={photo.src.medium}
                alt={photo.alt || `Foto de ${photo.photographer}`}
                width={photo.width}
                height={photo.height}
                className="h-auto w-full cursor-pointer object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
          {videos.map((video, index) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              style={{ "--i": index } as CSSProperties}
              className="animate-card-in group relative mb-4 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-lg bg-zinc-100 text-left dark:bg-zinc-900"
            >
              <ImageWithSkeleton
                src={video.image}
                alt={`Video de ${video.user.name}`}
                width={video.width}
                height={video.height}
                className="h-auto w-full cursor-pointer object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90">
                  <Play className="ml-0.5 h-5 w-5 fill-black text-black" />
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl gap-0 overflow-hidden rounded-2xl border-none bg-white p-0 text-zinc-950 ring-0 sm:max-w-4xl"
        >
          {selectedPhoto && (
            <>
              <DialogTitle className="sr-only">Foto de {selectedPhoto.photographer}</DialogTitle>
              <DialogDescription className="sr-only">
                {selectedPhoto.alt || `Foto de ${selectedPhoto.photographer}`}
              </DialogDescription>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <a
                  href={selectedPhoto.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-black/50 px-3 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver en Pexels
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="relative flex h-[75vh] w-full items-center justify-center bg-black">
                <Image
                  key={selectedPhoto.id}
                  src={selectedPhoto.src.original}
                  alt={selectedPhoto.alt || `Foto de ${selectedPhoto.photographer}`}
                  width={selectedPhoto.width}
                  height={selectedPhoto.height}
                  className="h-full w-full object-contain"
                  priority
                />

                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Foto anterior"
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Siguiente foto"
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-zinc-900">
                    {selectedPhoto.alt || "Sin descripción"}
                  </p>
                  <button
                    type="button"
                    onClick={() => removePhoto(selectedPhoto)}
                    aria-label="Quitar de favoritos"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-zinc-400" />
                    <a
                      href={selectedPhoto.photographer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {selectedPhoto.photographer}
                    </a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize className="h-4 w-4 text-zinc-400" />
                    {selectedPhoto.width} x {selectedPhoto.height} px
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-zinc-400" />
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: selectedPhoto.avg_color }}
                    />
                    {selectedPhoto.avg_color}
                  </span>
                </div>
              </div>
            </>
          )}

          {selectedVideo && (
            <>
              <DialogTitle className="sr-only">Video de {selectedVideo.user.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Video de {selectedVideo.user.name}
              </DialogDescription>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full bg-black/50 px-3 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver en Pexels
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  aria-label="Cerrar"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="relative flex h-[75vh] w-full items-center justify-center bg-black">
                <video
                  key={selectedVideo.id}
                  src={bestVideoFile(selectedVideo)?.link}
                  poster={selectedVideo.image}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />

                <button
                  type="button"
                  onClick={showPrev}
                  aria-label="Video anterior"
                  className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Siguiente video"
                  className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-1 p-5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-zinc-900">
                    Video por{" "}
                    <a
                      href={selectedVideo.user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {selectedVideo.user.name}
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => removeVideo(selectedVideo)}
                    aria-label="Quitar de favoritos"
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black"
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
