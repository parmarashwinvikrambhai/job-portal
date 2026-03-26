import express from "express";
import { isAuthorizedUser, isAdmin } from "../middleware/auth-middleware";
import { getReportsStats } from "../controllers/report-controller";

const router = express.Router();

router.get("/stats", isAuthorizedUser, isAdmin, getReportsStats);

export default router;
