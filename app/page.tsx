import { getCuratedPhotos, getPopularVideos } from "@/lib/pexels";
import { Hero } from "@/components/hero";
import { GallerySection } from "@/components/gallery-section";

export default async function Home() {
  const [photos, videos] = await Promise.all([
    getCuratedPhotos(),
    getPopularVideos(),
  ]);

  return (
    <main className="flex-1">
      <Hero photos={photos} />

      <div className="mx-auto w-full max-w-[100rem] px-6 py-12">
        <GallerySection initialPhotos={photos} initialVideos={videos} />
      </div>
    </main>
  );
}
