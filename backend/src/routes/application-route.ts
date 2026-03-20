import express from "express";
import {
  applyJob,
  getJobApplications,
  getUserApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} from "../controllers/application-controller";
import { isAuthorizedUser } from "../middleware/auth-middleware";
import { upload } from "../middleware/upload";

const router = express.Router();

router.post("/apply/:jobId", isAuthorizedUser, upload.single("resume"), applyJob);
router.get("/job/:jobId", isAuthorizedUser, getJobApplications);
router.get("/user", isAuthorizedUser, getUserApplications);
router.get("/recruiter", isAuthorizedUser, getRecruiterApplications);
router.put("/status/:id", isAuthorizedUser, updateApplicationStatus);

export default router;
