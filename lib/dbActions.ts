import { User, UserWithoutPassword } from "@/types/User";
import clientPromise from "./mongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";

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
    const token = jwt.sign(userFixed, process.env.JWT_SECRET!, {
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

export async function checkAuth() {
  const cookieSet = await cookies();
  const token = cookieSet.get("token")?.value;
  if (!token) {
    return { error: "Not logged in", status: 401 };
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
    )
      return { error: "Invalid token payload", status: 401 };

    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db("devpulse");

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return { error: "User not found", status: 404 };
    }

    const userWithoutPassword: UserWithoutPassword = {
      _id: user._id.toString(),
      name: user.name!,
      email: user.email!,
      jobTitle: user.jobTitle,
      department: user.department,
      role: user.role,
      bio: user.bio,
      verified: user.verified,
      joinedAt: user.joinedAt,
      lastActive: user.lastActive,
      twoFactorEnabled: user.twoFactorEnabled,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString(),
    };

    return { userWithoutPassword, message: "User found", status: 200 };
  } catch (err) {
    console.error(err);
    return { message: "Internal server error", status: 500 };
  }
}

export async function updateBio(data: any) {
  if (!data || Object.keys(data).length === 0) {
    return { message: "Values should not be empty", status: 400 };
  }
  const { userId, name, jobTitle, department, bio } = data;

  try {
    const client = await clientPromise;
    const db = client.db("devpulse");

    const existingUser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    console.log(existingUser);

    if (existingUser) {
      const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: { name, jobTitle, department, bio },
        }
      );

      return {
        message: "User sucessfully updated!",
        result,
        status: 200,
      };
    } else {
      return { message: "Internal Server Error", status: 500 };
    }
  } catch (error) {
    return { message: "Internal Server Error", status: 500 };
  }
}
