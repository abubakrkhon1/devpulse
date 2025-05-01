import { NextRequest, NextResponse } from "next/server";
import { fetchProjects } from "@/lib/dbActions";

export async function GET(req: NextRequest) {
  const res = await fetchProjects();
  if (res.status === 200) {
    return NextResponse.json(
      { message: res.message, projects: res.projects },
      { status: res.status }
    );
  } else {
    return NextResponse.json({ message: res.message }, { status: res.status });
  }
}
