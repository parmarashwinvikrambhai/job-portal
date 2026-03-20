import type { Request, Response } from "express";
import userRepositories from "../repositories/auth-repositories";
import { ZodError } from "zod";
import { loginSchema, registerSchema, updateProfileSchema } from "../validators/user-validator";
import bcrypt from "bcrypt";
import User from "../models/user-model";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const validateData = registerSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const { name, email, password, role, company } = validateData.data;
    const hashPassword = await bcrypt.hash(password, 10);
    const existingUser = await userRepositories.findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = await userRepositories.createUser({
      name,
      email,
      password: hashPassword,
      role,
      company,
    });

    res.status(201).json({
      message: "User Registered successfully...",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    });
  } catch (error) {
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.safeParse(req.body);
    if (!validateData.success) {
      return res
        .status(400)
        .json({ message: validateData.error.issues[0]?.message });
    }
    const { email, password } = validateData.data;
    const user = await User.findOne({ email }).populate({
      path: "savedJobs",
      populate: { path: "company", select: "name logo" },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "invalid email or User not found..." });
    }
    const isMatching = await bcrypt.compare(password, user.password);
    if (!isMatching) {
      return res.status(404).json({ message: "Invalid Password..." });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(404).json({ message: "missing secret" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successfull",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        location: user.location,
        phone: user.phone,
        experience: user.experience,
        savedJobs: user.savedJobs,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal server error...",
    });
  }
};
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Loggedout successfully" });
  } catch (error) {
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal server error...",
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const validateData = updateProfileSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: validateData.data },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        location: updatedUser.location,
        phone: updatedUser.phone,
        experience: updatedUser.experience,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
  }
};
