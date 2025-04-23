import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  if (!token)
    return NextResponse.json(
      { message: "No token found", status: 404 },
      { status: 404 }
    );
  cookie.delete("token");
  console.log(token);
  return NextResponse.json("Removed token!");
}
