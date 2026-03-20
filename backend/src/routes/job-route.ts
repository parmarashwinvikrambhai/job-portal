import express from "express";
import {
  createJob,
  getJobsByRecruiter,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById,
  toggleSaveJob,
} from "../controllers/job-controller";
import { isAuthorizedUser } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/create", isAuthorizedUser, createJob);
router.get("/", getAllJobs);
router.get("/recruiter/:recruiterId", isAuthorizedUser, getJobsByRecruiter);
router.put("/update/:jobId", isAuthorizedUser, updateJob);
router.delete("/:jobId", isAuthorizedUser, deleteJob);
router.get("/:jobId", getJobById);
router.post("/toggle-save-job/:jobId", isAuthorizedUser, toggleSaveJob);

export default router;
