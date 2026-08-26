import { getCuratedPhotos } from "@/lib/pexels";
import { DiscoverFeed } from "@/components/discover-feed";

export default async function DescubrirPage() {
  const photos = await getCuratedPhotos();

  return (
    <main className="flex-1">
      <DiscoverFeed initialPhotos={photos} />
    </main>
  );
}
