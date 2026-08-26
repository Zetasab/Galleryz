import { NextRequest, NextResponse } from "next/server";
import { getCuratedPhotos } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const photos = await getCuratedPhotos(page);
  return NextResponse.json({ photos });
}
