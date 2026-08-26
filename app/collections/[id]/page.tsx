import { getCollectionMedia } from "@/lib/pexels";
import { CollectionMediaView } from "@/components/collection-media-view";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCollectionMedia(id, 1, 30, "desc");

  return (
    <main className="flex-1 pt-32">
      <div className="mx-auto w-full max-w-[100rem] px-6 pb-12">
        <CollectionMediaView collectionId={id} initialData={data} />
      </div>
    </main>
  );
}
