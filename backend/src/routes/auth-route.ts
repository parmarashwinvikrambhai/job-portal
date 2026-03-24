import express from "express";
import {
  createUser,
  deleteUserByAdmin,
  getAllUsers,
  loginUser,
  logoutUser,
  updateProfile,
  updateUserByAdmin,
} from "../controllers/auth-controller";
import { isAdmin, isAuthorizedUser } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/profile", isAuthorizedUser, updateProfile);

// Admin Routes
router.get("/all-users", isAuthorizedUser, isAdmin, getAllUsers);
router.put("/update-user/:id", isAuthorizedUser, isAdmin, updateUserByAdmin);
router.delete("/delete-user/:id", isAuthorizedUser, isAdmin, deleteUserByAdmin);

export default router;
