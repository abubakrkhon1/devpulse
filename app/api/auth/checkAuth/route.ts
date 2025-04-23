import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongo";
import type { User } from "@/types/User";

export async function GET() {
  const cookieSet = await cookies();
  const token = cookieSet.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    // decode returns string | JwtPayload
    const decoded = jwt.decode(token);

    // narrow: make sure it's an object and has userId
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }
    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db("devpulse");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userWithoutPassword: User = {
      _id: user._id.toString(),
      name: user.name!,
      email: user.email!,
      createdAt: user.createdAt.toISOString(),
    };

    return NextResponse.json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
