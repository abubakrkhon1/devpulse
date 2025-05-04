import { updatePassword } from "@/lib/dbActions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const res = await updatePassword(data);
  console.log(res)
  if (res.status === 200) {
    return NextResponse.json(
      { message: "Sucessfully updated password", status: 200 },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      { message: res.message, status: res.status },
      { status: res.status }
    );
  }
}
