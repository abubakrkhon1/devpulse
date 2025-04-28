// src/types/User.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  jobTitle: string;
  department: string;
  role: string;
  verified: boolean;
  bio: string;
  joinedAt: string;
  isOnline: boolean;
  lastActive: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}

export type UserWithoutPassword = Omit<User, "password">;
