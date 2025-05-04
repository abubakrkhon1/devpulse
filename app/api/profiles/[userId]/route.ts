// app/api/profiles/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchProfile } from "@/lib/dbActions";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  // await the dynamic params promise
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const result = await fetchProfile(userId);
  if (!result.profile) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ⚠️ Must match what your hook reads: data.otherProfile
  return NextResponse.json({ otherProfile: result.profile });
}
