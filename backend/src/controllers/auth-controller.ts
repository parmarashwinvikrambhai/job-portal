import type { Request, Response } from "express";
import userRepositories from "../repositories/auth-repositories";
import { ZodError } from "zod";
import { loginSchema, registerSchema, updateProfileSchema, changePasswordSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/user-validator";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcrypt";
import User from "../models/user-model";
import Company from "../models/company-model";
import Job from "../models/job-model";
import Application from "../models/application-model";
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

    if (user.status && user.status !== "active") {
      return res.status(403).json({
        message: `Your account is ${user.status}. Please contact support.`,
      });
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const currentAdminId = (req as any).user.id;
    const { search } = req.query;

    let query: any = { _id: { $ne: currentAdminId } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).select("-password");

    // For recruiters, add their company name
    const usersWithCompany = await Promise.all(
      users.map(async (user) => {
        const userData = user.toObject();
        if (userData.role === "recruiter") {
          // Check if user has a company string in their profile first
          if (userData.company) {
            return { ...userData, companyName: userData.company };
          }
          // Fallback to Company collection
          const company = await Company.findOne({ recruiterId: userData._id });
          return { ...userData, companyName: company?.name || "No Company" };
        }
        return userData;
      })
    );

    res.status(200).json({ users: usersWithCompany });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { role, status } },
      { new: true },
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User By Admin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User By Admin Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const activeJobs = await Job.countDocuments({ status: "open" });
    const totalApplications = await Application.countDocuments();
    const totalCompanies = await Company.countDocuments();

    // Fetch recent users (last 5, excluding admins)
    const recentUsers = await User.find({ role: { $ne: "admin" } })
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recent applications (last 5)
    const recentApplications = await Application.find()
      .populate("applicant", "name email")
      .populate("job", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeJobs,
        totalApplications,
        totalCompanies,
      },
      recentActivity: {
        users: recentUsers,
        applications: recentApplications,
      },
    });
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const validateData = changePasswordSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const { newPassword } = validateData.data;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal server error...",
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const validateData = forgotPasswordSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({ message: validateData.error.issues[0]?.message });
    }

    const { email } = validateData.data;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save to database
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordToken = hashedToken;
    
    // Set expire for 15 minutes
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) requested a password reset.
      Please click on the following link, or paste this into your browser to complete the process:
      
      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Email Sending Error", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    
    if (!token || typeof token !== "string") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const validateData = resetPasswordSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({ message: validateData.error.issues[0]?.message });
    }

    const { password } = validateData.data;

    // Hash the token from URL to match the one in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash new password
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    
    // Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
