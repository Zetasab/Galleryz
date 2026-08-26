"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PexelsPhoto } from "@/lib/pexels";
import { MAX_FAVORITES, isFavorite, toggleFavorite } from "@/lib/favorites";
import { ExternalLink, Heart, User } from "lucide-react";
import { toast } from "sonner";

function DiscoverSlide({ photo }: { photo: PexelsPhoto }) {
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(photo.id));
  }, [photo.id]);

  return (
    <section className="flex h-screen w-full shrink-0 snap-start items-center justify-center bg-zinc-300 pt-24">
      <div className="relative h-full w-full max-w-xl bg-zinc-300">
        <Image
          src={photo.src.large}
          alt={photo.alt || `Foto de ${photo.photographer}`}
          fill
          sizes="576px"
          className="object-contain"
          priority={false}
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10">
          <div className="flex flex-col gap-1 text-white">
            <p className="max-w-[220px] text-sm font-medium">
              {photo.alt || "Sin descripción"}
            </p>
            <span className="flex items-center gap-1.5 text-xs text-zinc-300">
              <User className="h-3.5 w-3.5" />
              {photo.photographer}
            </span>
          </div>

          <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const result = toggleFavorite(photo);
              if (result.limitReached) {
                toast.error(`Solo puedes guardar un máximo de ${MAX_FAVORITES} fotos`);
                return;
              }
              setFavorite(result.favorited);
            }}
            aria-label={favorite ? "Quitar de favoritos" : "Guardar como favorito"}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Heart className={`h-6 w-6 ${favorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver en Pexels"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DiscoverFeed({ initialPhotos }: { initialPhotos: PexelsPhoto[] }) {
  const [pages, setPages] = useState<PexelsPhoto[][]>([initialPhotos]);
  const photos = pages.flat();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
      { rootMargin: "1000px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, loading]);

  return (
    <div className="h-screen w-full snap-y snap-mandatory overflow-y-scroll">
      {photos.map((photo) => (
        <DiscoverSlide key={photo.id} photo={photo} />
      ))}
      <div ref={sentinelRef} className="h-1 w-full" />
    </div>
  );
}
