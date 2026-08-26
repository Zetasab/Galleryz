import { getFeaturedCollections } from "@/lib/pexels";
import { CollectionsView } from "@/components/collections-view";

export default async function CollectionsPage() {
  const data = await getFeaturedCollections(1, 1);

  return (
    <main className="flex-1 pt-32">
      <div className="mx-auto w-full max-w-[100rem] px-6 pb-12">
        <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-zinc-900">
          Colecciones
        </h1>
        <CollectionsView initialData={data} />
      </div>
    </main>
  );
}
