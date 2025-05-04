import { goOffline } from "@/lib/dbActions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = await req.json();
    const res = await goOffline(userId);

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
  