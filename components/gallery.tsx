"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PexelsPhoto } from "@/lib/pexels";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { MAX_FAVORITES, isFavorite, toggleFavorite } from "@/lib/favorites";
import { toast } from "sonner";
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
  Loader2,
  Maximize,
  Palette,
  User,
  XIcon,
} from "lucide-react";

export function Gallery({ initialPhotos }: { initialPhotos: PexelsPhoto[] }) {
  const [pages, setPages] = useState<PexelsPhoto[][]>([initialPhotos]);
  const photos = pages.flat();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          const nextPage = page + 1;
          fetch(`/api/photos?page=${nextPage}`)
            .then((res) => res.json())
            .then((data: { photos: PexelsPhoto[] }) => {
              setPages((prev) => [...prev, data.photos]);
              setPage(nextPage);
            })
            .finally(() => setLoading(false));
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, loading]);

  const showPrev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }, [photos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, showPrev, showNext]);

  const selected = selectedIndex !== null ? photos[selectedIndex] : null;

  useEffect(() => {
    setImageLoading(true);
    setFavorite(selected ? isFavorite(selected.id) : false);
  }, [selectedIndex, selected]);

  let indexOffset = 0;

  return (
    <div>
      {pages.map((pagePhotos, pageIndex) => {
        const startIndex = indexOffset;
        indexOffset += pagePhotos.length;
        return (
          <div
            key={pageIndex}
            className={`columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 ${
              pageIndex > 0 ? "mt-4" : ""
            }`}
          >
            {pagePhotos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(startIndex + i)}
                style={{ "--i": i } as CSSProperties}
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
        );
      })}
      <div ref={sentinelRef} className="h-1 w-full" />
      {loading && (
        <p className="py-6 text-center text-sm text-zinc-500">Cargando más fotos…</p>
      )}

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl gap-0 overflow-hidden rounded-2xl border-none bg-white p-0 text-zinc-950 ring-0 sm:max-w-4xl"
        >
          {selected && (
            <>
              <DialogTitle className="sr-only">
                Foto de {selected.photographer}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {selected.alt || `Foto de ${selected.photographer}`}
              </DialogDescription>

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <a
                  href={selected.url}
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
                {imageLoading && (
                  <div className="absolute inset-0 z-[5] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-white/70" />
                  </div>
                )}
                <Image
                  key={selected.id}
                  src={selected.src.original}
                  alt={selected.alt || `Foto de ${selected.photographer}`}
                  width={selected.width}
                  height={selected.height}
                  className={`h-full w-full object-contain transition-opacity duration-200 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
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
                    {selected.alt || "Sin descripción"}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const result = toggleFavorite(selected);
                      if (result.limitReached) {
                        toast.error(
                          `Solo puedes guardar un máximo de ${MAX_FAVORITES} fotos`,
                        );
                        return;
                      }
                      setFavorite(result.favorited);
                    }}
                    aria-label={
                      favorite ? "Quitar de favoritos" : "Guardar como favorito"
                    }
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorite ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-600">
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-zinc-400" />
                    <a
                      href={selected.photographer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {selected.photographer}
                    </a>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Maximize className="h-4 w-4 text-zinc-400" />
                    {selected.width} x {selected.height} px
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-zinc-400" />
                    <span
                      className="h-4 w-4 rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: selected.avg_color }}
                    />
                    {selected.avg_color}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
