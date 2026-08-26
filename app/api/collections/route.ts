import { NextRequest, NextResponse } from "next/server";
import { getFeaturedCollections } from "@/lib/pexels";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "1");
  const data = await getFeaturedCollections(page, 1);
  return NextResponse.json(data);
}
