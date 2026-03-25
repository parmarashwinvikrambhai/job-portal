import type { Request, Response } from "express";
import Application from "../models/application-model";
import Job from "../models/job-model";
import { applicationSchema } from "../validators/application-validator";
import { ZodError } from "zod";

export const applyJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user.id;

    if (!jobId || typeof jobId !== "string") {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const validateData = applicationSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const { phone, coverLetter } = validateData.data;

    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId as any,
      applicant: userId as any,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: userId,
      phone,
      coverLetter: coverLetter || "",
      resume: `/uploads/resumes/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user.id;

    if (!jobId || typeof jobId !== "string") {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Only recruiter who created the job or admin can see applications
    if (job.createdBy.toString() !== userId && (req as any).user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view applications for this job" });
    }

    const applications = await Application.find({ job: jobId as any })
      .populate("applicant", "name email profileImage skills bio phone location experience")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get Job Applications Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const applications = await Application.find({ applicant: userId as any })
      .populate({
        path: "job",
        populate: { path: "company", select: "name logo" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get User Applications Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecruiterApplications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Find all jobs created by this recruiter
    const jobs = await Job.find({ createdBy: userId as any });
    const jobIds = jobs.map((job) => job._id);

    // Find all applications for these jobs
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email profileImage skills bio phone location experience")
      .populate("job", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get Recruiter Applications Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    if (!status || !["pending", "accepted", "rejected", "shortlisted", "hired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Verify the recruiter owns the job
    const job = application.job as any;
    if (job.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    console.error("Update Application Status Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
