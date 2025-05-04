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
  joinedAt: Date;
  isOnline: boolean;
  lastActive: Date;
  twoFactorEnabled: boolean;
  loginDevices: LoginDevice[];
  createdAt: Date;
}

export interface LoginDevice {
  deviceType?: string;
  browser?: string;
  os?: string;
  loggedInAt: Date;
}

export interface ProjectIdea {
  _id: string;
  projectName: string;
  problem: string;
  audience: string;
  features: [];
  notes: string;
  createdAt: Date;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planning" | "review";
  priority: "urgent" | "high" | "medium" | "low";
  tasks: number;
  completedTasks: number;
  dueDate: string;
  team: [];
  teamColors: [];
  progress: number;
}

export type UserWithoutPassword = Omit<User, "password">;

export type OtherProfile = {
  _id: string;
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  role: string;
  bio: string;
  verified: boolean;
  joinedAt: Date;
  lastActive: Date;
  avatar: string;
  isOnline: true;
  createdAt: Date;
};
