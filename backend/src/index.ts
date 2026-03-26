import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/db";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth-route";
import companyRoutes from "./routes/company-route";
import jobRoutes from "./routes/job-route";
import applicationRoutes from "./routes/application-route";
import reportRoutes from "./routes/report-route";
import path from "path";

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Static folder for file uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => {
  console.log(`server Running on http://localhost:${PORT}`);
});
