import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  updateProfile,
} from "../controllers/auth-controller";
import { isAuthorizedUser } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/profile", isAuthorizedUser, updateProfile);

export default router;
