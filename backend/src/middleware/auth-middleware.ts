import { Response, Request, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user-model";

export const isAuthorizedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.header("authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "token not provided" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "secret is missing provided" });
    }
    const decode = jwt.verify(token, secret) as JwtPayload;
    
    // Check if user still exists and is active
    const user = await User.findById(decode.id);
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.status !== "active") {
      res.clearCookie("token");
      return res.status(403).json({ message: `Your account is ${user.status}. Please contact support.` });
    }

    req.user = decode;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.clearCookie("token");
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
};
