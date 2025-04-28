import { checkAuth } from "@/lib/dbActions";
import { NextResponse } from "next/server";

export async function GET() {
  const res = await checkAuth();
  if (res.status === 200) {
    return NextResponse.json(
      { user: res.userWithoutPassword },
      { status: res.status }
    );
  } else {
    return NextResponse.json({ message: res.message }, { status: res.status });
  }
}
