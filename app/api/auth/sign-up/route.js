import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongo.ts";

export async function POST(req) {
  const { name, email, password } = await req.json();
  try {
    const client = await clientPromise;
    const db = client.db("devpulse");

    const existingUser = await db.collection("users").findOne({ email });
    console.log(existingUser);

    if (existingUser)
      return NextResponse.json(
        { message: "User already exists", status: 400 },
        { status: 400 }
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .collection("users")
      .insertOne({
        name,
        email,
        password: hashedPassword,
        createdAt: new Date(),
      });

    return NextResponse.json({
      message: "User sucessfully created!",
      result,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error", status: 500 });
  }
}
