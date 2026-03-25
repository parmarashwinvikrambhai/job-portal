import express from "express";
import {
  registerCompany,
  getCompanyByRecruiter,
  updateCompany,
  getAdminCompanies,
  deleteCompany,
} from "../controllers/company-controller";
import { upload } from "../middleware/upload";
import { isAuthorizedUser, isAdmin } from "../middleware/auth-middleware";

const router = express.Router();

router.post("/register", isAuthorizedUser, upload.single("logo"), registerCompany);
router.get("/recruiter/:recruiterId", isAuthorizedUser, getCompanyByRecruiter);
router.put("/update/:id", isAuthorizedUser, upload.single("logo"), updateCompany);
router.get("/admin/all", isAuthorizedUser, isAdmin, getAdminCompanies);
router.delete("/:id", isAuthorizedUser, isAdmin, deleteCompany);

export default router;
