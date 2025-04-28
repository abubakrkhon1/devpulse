import { signIn } from "@/lib/dbActions";
import { LoginDevice } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const userAgent = req.headers.get("user-agent") || "";

  const parser = new UAParser();
  parser.setUA(userAgent);

  const deviceInfo = parser.getResult();

  const deviceData: LoginDevice = {
    deviceType: deviceInfo.device.type || "desktop",
    browser: deviceInfo.browser.name,
    os: deviceInfo.os.name,
    loggedInAt: new Date(),
  };

  const res = await signIn(data, deviceData);
  if (res.status === 200) {
    return NextResponse.json(res, { status: res.status });
  } else {
    return NextResponse.json({ message: res.message }, { status: res.status });
  }
}
