// app/api/friends/remove/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function DELETE(req: NextRequest) {
  const { userId, friendId } = await req.json();

  if (!userId || !friendId) {
    return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("devpulse");

  // Remove each user from the other's friends array
  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friends: { _id: new ObjectId(friendId) } } as any }
    );

  await db
    .collection("users")
    .updateOne(
      { _id: new ObjectId(friendId) },
      { $pull: { friends: { _id: new ObjectId(userId) } } as any }
    );
  return NextResponse.json({ success: true });
}
