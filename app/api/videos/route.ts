import { NextRequest, NextResponse } from "next/server";
import { getPopularVideos } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const videos = await getPopularVideos(page);
  return NextResponse.json({ videos });
}
