import { User } from "@/types/User";
import clientPromise from "./mongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function signUp(data: User) {
  const {
    name,
    email,
    password,
    jobTitle,
    department,
    role,
    bio,
    twoFactorEnabled,
    verified,
  } = data;

  try {
    const client = await clientPromise;
    const db = client.db("devpulse");

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) return { message: "User already exists", status: 400 };

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      jobTitle,
      department,
      role,
      bio,
      twoFactorEnabled,
      verified,
      avatar: "https://github.com/shadcn.png",
      createdAt: new Date(),
    });

    return {
      message: "User sucessfully created!",
      result,
      status: 200,
    };
  } catch (error) {
    return { message: "Internal Server Error", status: 500 };
  }
}

export async function signIn(data: User) {
  const { email, password } = data;
  try {
    const client = await clientPromise;
    const db = client.db("devpulse");

    const user = await db.collection("users").findOne({ email });

    if (!user) return { message: "User not found!", status: 404 };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return { message: "Passwords do not match!", status: 401 };

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

    return { message: "Login successful", status: 200 };
  } catch (error) {
    return { message: "Internal Server Error", status: 500 };
  }
}
