import { VideoSearch } from "@/components/video-search";

export default function VideotecaPage() {
  return (
    <main className="flex-1 pt-32">
      <div className="mx-auto w-full max-w-[100rem] px-6 pb-12">
        <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-zinc-900">
          Videoteca
        </h1>
        <VideoSearch />
      </div>
    </main>
  );
}
