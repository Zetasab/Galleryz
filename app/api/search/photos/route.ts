import { NextRequest, NextResponse } from "next/server";
import { searchPhotos } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("query");

  if (!query) {
    return NextResponse.json({ photos: [] });
  }

  const photos = await searchPhotos({
    query,
    page: Number(params.get("page") ?? "1"),
    orientation: (params.get("orientation") as "landscape" | "portrait" | "square") || undefined,
    size: (params.get("size") as "large" | "medium" | "small") || undefined,
    color: params.get("color") || undefined,
    locale: params.get("locale") || undefined,
  });

  return NextResponse.json({ photos });
}
