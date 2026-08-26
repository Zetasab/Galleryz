import Image from "next/image";
import type { PexelsPhoto } from "@/lib/pexels";

function chunkIntoColumns<T>(items: T[], columns: number): T[][] {
  const result: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => result[i % columns].push(item));
  return result;
}

export function Hero({ photos }: { photos: PexelsPhoto[] }) {
  const columns = chunkIntoColumns(photos, 5);

  return (
    <section className="relative h-[90vh] w-full overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 grid grid-cols-3 gap-3 px-3 sm:grid-cols-4 md:grid-cols-5">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`flex flex-col gap-3 ${
              i % 2 === 0 ? "animate-scroll-up" : "animate-scroll-down"
            }`}
          >
            {[...col, ...col].map((photo, j) => (
              <div
                key={`${photo.id}-${j}`}
                className="relative aspect-[3/4] w-full overflow-hidden rounded-lg"
              >
                <Image
                  src={photo.src.medium}
                  alt=""
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <Image
          src="/icon.png"
          alt="Galleryz"
          width={140}
          height={140}
          className="drop-shadow-lg"
        />
        <h1 className="text-6xl font-semibold tracking-tight text-white sm:text-8xl">
          Galleryz
        </h1>
        <p className="max-w-lg text-base text-zinc-300 sm:text-lg">
          Una galería de imágenes minimalista
        </p>
      </div>
    </section>
  );
}
