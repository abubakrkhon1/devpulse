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
  lastActive: string;
  twoFactorEnabled: boolean;
  createdAt: string;
}
