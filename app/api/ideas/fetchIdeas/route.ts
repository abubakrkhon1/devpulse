import { NextRequest, NextResponse } from "next/server";
import { fetchIdeas, newIdea } from "@/lib/dbActions";

export async function GET(req: NextRequest) {
  const res = await fetchIdeas();
  if (res.status === 200) {
    return NextResponse.json(
      { message: res.message, ideas: res.ideas },
      { status: res.status }
    );
  } else {
    return NextResponse.json({ message: res.message }, { status: res.status });
  }
}
