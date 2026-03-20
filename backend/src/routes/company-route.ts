import express from "express";
import {
  registerCompany,
  getCompanyByRecruiter,
  updateCompany,
} from "../controllers/company-controller";
import { upload } from "../middleware/upload";
import { isAuthorizedUser } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/register", isAuthorizedUser, upload.single("logo"), registerCompany);
router.get("/recruiter/:recruiterId", isAuthorizedUser, getCompanyByRecruiter);
router.put("/update/:id", isAuthorizedUser, upload.single("logo"), updateCompany);

export default router;
