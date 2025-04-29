// app/api/profile/updateStatus/route.ts
import { goOnline } from "@/lib/dbActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();        // <-- destructure
  if (!userId) {
    return NextResponse.json(
      { message: "Missing userId" },
      { status: 400 }
    );
  }

  const result = await goOnline(userId);      // <-- pass just the string
  return NextResponse.json(
    { message: result.message },
    { status: result.status }
  );
}
