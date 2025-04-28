import { updateBio } from "@/lib/dbActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  const res = await updateBio(data);
  
  if (res.status === 200) {
    return NextResponse.json({ message: res.message }, { status: res.status });
  } else {
    return NextResponse.json({ message: res.message }, { status: res.status });
  }
}
