import mongoose from "mongoose";

export type UserRole = "jobseeker" | "recruiter" | "admin";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  company?: string | undefined;
  profilePic?: string;
  resume?: string;
  skills?: string[];
  phone?: string;
  location?: string;
  bio?: string;
  savedJobs?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICreateUser = Omit<IUser, "createdAt" | "updatedAt">;


