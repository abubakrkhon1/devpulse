import { NextRequest, NextResponse } from "next/server";
import { getStatus } from "@/lib/dbActions";

// This is a threshold in minutes to determine if a user is considered "online"
export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const res = await getStatus(userId);
  if (res.status === 200) {
    return NextResponse.json(res);
  } else {
    return NextResponse.json(
      { message: "Internal server error", status: 500 },
      { status: 500 }
    );
  }
}