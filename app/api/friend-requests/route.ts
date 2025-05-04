// app/api/friend-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongo";

export async function POST(req: NextRequest) {
  const { requester, recipient } = await req.json();
  if (requester === recipient)
    return NextResponse.json(
      { error: "Can't friend yourself" },
      { status: 400 }
    );

  const client = await clientPromise;
  const db = client.db("devpulse");
  // idempotently create or fail if exists
  const exists = await db.collection("friend-requests").findOne({
    requester: new ObjectId(requester),
    recipient: new ObjectId(recipient),
    status: "pending",
  });
  if (exists) {
    return NextResponse.json(
      { error: "Request already pending" },
      { status: 409 }
    );
  }
  await db.collection("friend-requests").insertOne({
    requester: new ObjectId(requester),
    recipient: new ObjectId(recipient),
    status: "pending",
    createdAt: new Date(),
  });
  return NextResponse.json({ success: true });
}

// app/api/friend-requests/route.ts (add)
export async function DELETE(req: NextRequest) {
  const { requester, recipient } = await req.json();
  const client = await clientPromise;
  await client
    .db("devpulse")
    .collection("friend-requests")
    .deleteOne({
      requester: new ObjectId(requester),
      recipient: new ObjectId(recipient),
      status: "pending",
    });
  return NextResponse.json({ success: true });
}

// Get pending friend requests
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing" }, { status: 400 });
  const client = await clientPromise;
  const db = client.db("devpulse");
  // incoming
  const incoming = await db
    .collection("friend-requests")
    .find({ recipient: new ObjectId(userId), status: "pending" })
    .toArray();
  // outgoing
  const outgoing = await db
    .collection("friend-requests")
    .find({ requester: new ObjectId(userId), status: "pending" })
    .toArray();
  return NextResponse.json({ incoming, outgoing });
}

// Accept friend request
export async function PATCH(req: NextRequest) {
  const { requester, recipient, accept } = await req.json();
  console.log(requester,recipient,accept)
  const client = await clientPromise;
  const db = client.db("devpulse");
  const filter = {
    requester: new ObjectId(requester),
    recipient: new ObjectId(recipient),
    status: "pending",
  };
  if (accept) {
    const requesterProfile = await db.collection("users").findOne(
      { _id: new ObjectId(requester) },
      {
        projection: {
          password: 0,
          twoFactorEnabled: 0,
          loginDevices: 0,
          createdAt: 0,
          friends: 0,
        },
      }
    );

    const recipientProfile = await db.collection("users").findOne(
      { _id: new ObjectId(recipient) },
      {
        projection: {
          password: 0,
          twoFactorEnabled: 0,
          loginDevices: 0,
          createdAt: 0,
          friends: 0,
        },
      }
    );

    // 1) mark request accepted
    await db
      .collection("friend-requests")
      .updateOne(filter, { $set: { status: "accepted" } });
    // 2) add each to the other's friends[]
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(requester) },
        { $addToSet: { friends: recipientProfile } }
      );
    await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(recipient) },
        { $addToSet: { friends: requesterProfile } }
      );
  } else {
    // reject
    await db
      .collection("friend-requests")
      .updateOne(filter, { $set: { status: "rejected" } });
  }
  return NextResponse.json({ success: true });
}
