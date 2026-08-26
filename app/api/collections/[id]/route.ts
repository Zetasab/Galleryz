import { NextRequest, NextResponse } from "next/server";
import { getCollectionMedia } from "@/lib/pexels";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const data = await getCollectionMedia(id, page, 30, "desc");
  return NextResponse.json(data);
}
