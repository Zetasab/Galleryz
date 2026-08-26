"use client";

import { ImageIcon, Video } from "lucide-react";

export type ContentTab = "photos" | "videos";

export function ContentTabs({
  active,
  onChange,
  noMargin,
}: {
  active: ContentTab;
  onChange: (tab: ContentTab) => void;
  noMargin?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center gap-4 text-sm font-medium ${
        noMargin ? "" : "mb-8"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange("photos")}
        className={`flex cursor-pointer items-center gap-2 transition-colors ${
          active === "photos" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        <ImageIcon className="h-4 w-4 text-blue-500" />
        Imágenes
      </button>
      <span className="h-5 w-px bg-zinc-200" />
      <button
        type="button"
        onClick={() => onChange("videos")}
        className={`flex cursor-pointer items-center gap-2 transition-colors ${
          active === "videos" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        <Video className="h-4 w-4 text-purple-500" />
        Videos
      </button>
    </div>
  );
}
