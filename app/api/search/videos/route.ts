import { NextRequest, NextResponse } from "next/server";
import { searchVideos } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("query");

  if (!query) {
    return NextResponse.json({ videos: [] });
  }

  const videos = await searchVideos({
    query,
    page: Number(params.get("page") ?? "1"),
    orientation: (params.get("orientation") as "landscape" | "portrait" | "square") || undefined,
    size: (params.get("size") as "large" | "medium" | "small") || undefined,
    locale: params.get("locale") || undefined,
  });

  return NextResponse.json({ videos });
}
