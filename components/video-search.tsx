"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PexelsVideo } from "@/lib/pexels";
import { ImageWithSkeleton } from "@/components/image-with-skeleton";
import { MAX_FAVORITES, isFavoriteVideo, toggleFavoriteVideo } from "@/lib/favorites";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Play,
  Search,
  XIcon,
} from "lucide-react";
import { FilterDialog } from "@/components/filter-dialog";

function bestVideoFile(video: PexelsVideo) {
  return video.video_files.find((f) => f.quality === "hd") ?? video.video_files[0];
}

const ORIENTATIONS = [
  { value: "", label: "Cualquier orientación" },
  { value: "landscape", label: "Horizontal" },
  { value: "portrait", label: "Vertical" },
  { value: "square", label: "Cuadrada" },
];

const SIZES = [
  { value: "", label: "Cualquier tamaño" },
  { value: "large", label: "Grande (4K)" },
  { value: "medium", label: "Mediano (Full HD)" },
  { value: "small", label: "Pequeño (HD)" },
];

export function VideoSearch() {
  const [query, setQuery] = useState("");
  const [orientation, setOrientation] = useState("");
  const [size, setSize] = useState("");

  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [pages, setPages] = useState<PexelsVideo[][]>([]);
  const videos = pages.flat();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [favorite, setFavorite] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const buildParams = useCallback(
    (targetPage: number, forQuery: string) => {
      const params = new URLSearchParams();
      params.set("query", forQuery || "nature");
      params.set("page", String(targetPage));
      if (orientation) params.set("orientation", orientation);
      if (size) params.set("size", size);
      return params;
    },
    [orientation, size],
  );

  const search = useCallback(
    (forQuery: string) => {
      setActiveQuery(forQuery);
      setPage(1);
      setLoading(true);
      fetch(`/api/search/videos?${buildParams(1, forQuery).toString()}`)
        .then((res) => res.json())
        .then((data: { videos: PexelsVideo[] }) => setPages([data.videos]))
        .finally(() => setLoading(false));
    },
    [buildParams],
  );

  useEffect(() => {
    search("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || activeQuery === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          const nextPage = page + 1;
          fetch(`/api/search/videos?${buildParams(nextPage, activeQuery).toString()}`)
            .then((res) => res.json())
            .then((data: { videos: PexelsVideo[] }) => {
              setPages((prev) => [...prev, data.videos]);
              setPage(nextPage);
            })
            .finally(() => setLoading(false));
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, loading, activeQuery, buildParams]);

  const showPrev = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i - 1 + videos.length) % videos.length));
  }, [videos.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((i) => (i === null ? null : (i + 1) % videos.length));
  }, [videos.length]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, showPrev, showNext]);

  const selected = selectedIndex !== null ? videos[selectedIndex] : null;

  useEffect(() => {
    setFavorite(selected ? isFavoriteVideo(selected.id) : false);
  }, [selectedIndex, selected]);

  let indexOffset = 0;

  return (
    <div>
      <form onSubmit={runSearch} className="mx-auto mb-8 flex max-w-3xl flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar videos… (ej. océano, ciudad, animales)"
            className="w-full rounded-full border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <FilterDialog
            label="Orientación"
            options={ORIENTATIONS}
            value={orientation}
            onChange={setOrientation}
          />

          <FilterDialog label="Tamaño" options={SIZES} value={size} onChange={setSize} />

          <button
            type="submit"
            className="ml-auto cursor-pointer rounded-full bg-zinc-900 px-5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Buscar
          </button>
        </div>
      </form>

      {activeQuery === null ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          Escribe algo y pulsa buscar para encontrar videos.
        </p>
      ) : videos.length === 0 && !loading ? (
        <p className="py-16 text-center text-sm text-zinc-500">
          Sin resultados para &quot;{activeQuery}&quot;.
        </p>
      ) : (
        <>
          {pages.map((pageVideos, pageIndex) => {
            const startIndex = indexOffset;
            indexOffset += pageVideos.length;
            return (
              <div
                key={pageIndex}
                className={`columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4 ${
                  pageIndex > 0 ? "mt-4" : ""
                }`}
              >
                {pageVideos.map((video, i) => (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setSelectedIndex(startIndex + i)}
                    style={{ "--i": i } as CSSProperties}
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
            );
          })}
          <div ref={sentinelRef} className="h-1 w-full" />
        </>
      )}
      {loading && <p className="py-6 text-center text-sm text-zinc-500">Buscando…</p>}

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
              <DialogTitle className="sr-only">Video de {selected.user.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Video de {selected.user.name}
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
                <video
                  key={selected.id}
                  src={bestVideoFile(selected)?.link}
                  poster={selected.image}
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
                      href={selected.user.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 hover:text-black"
                    >
                      {selected.user.name}
                    </a>
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const result = toggleFavoriteVideo(selected);
                      if (result.limitReached) {
                        toast.error(
                          `Solo puedes guardar un máximo de ${MAX_FAVORITES} videos`,
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
