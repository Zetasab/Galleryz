"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FeaturedCollectionsResponse } from "@/lib/pexels";
import { ChevronLeft, ChevronRight, Images, Video } from "lucide-react";

export function CollectionsView({
  initialData,
}: {
  initialData: FeaturedCollectionsResponse;
}) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(initialData.page);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/collections?page=${page}`)
      .then((res) => res.json())
      .then((json: FeaturedCollectionsResponse) => setData(json))
      .finally(() => setLoading(false));
  }, [page]);

  const collection = data.collections[0];
  const totalPages = Math.ceil(data.total_results / data.per_page);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <p className="text-center text-sm text-zinc-500">Cargando…</p>
        ) : collection ? (
          <Link href={`/collections/${collection.id}`} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300">
              {collection.title}
            </h2>
            {collection.description && (
              <p className="text-sm text-zinc-500">{collection.description}</p>
            )}
            <div className="flex items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Images className="h-4 w-4 text-blue-500" />
                {collection.photos_count} fotos
              </span>
              <span className="flex items-center gap-1.5">
                <Video className="h-4 w-4 text-purple-500" />
                {collection.videos_count} videos
              </span>
            </div>
          </Link>
        ) : (
          <p className="text-center text-sm text-zinc-500">Sin colecciones.</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1 || loading}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>

        <span className="text-sm text-zinc-500">
          Página {page} de {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages || loading}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
