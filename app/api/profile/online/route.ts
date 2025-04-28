import { NextResponse } from "next/server";
import { goOnline } from "@/lib/dbActions";

export async function POST(req: Request) {
  const { userId } = await req.json();
  const res = await goOnline(userId);

  if (res.status === 200) {
    return NextResponse.json(
      { message: res.message, status: res.status },
      { status: res.status }
    );
  } else {
    return NextResponse.json(
      { message: res.message, status: res.status },
      { status: res.status }
    );
  }
}
