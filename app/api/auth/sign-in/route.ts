import clientPromise from "@/lib/mongo";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("devpulse");

    const user = await db.collection("users").findOne({ email });

    if (!user)
      return NextResponse.json(
        { message: "User not found!", status: 404 },
        { status: 404 }
      );

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return NextResponse.json(
        {
          message: "Passwords do not match!",
          status: 401,
        },
        { status: 401 }
      );

    const userFixed = { userId: user._id };
    const token = jwt.sign(userFixed, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const cookiesSet = await cookies();
    cookiesSet.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({ message: "Login successful", status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
