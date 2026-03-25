import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import Job from "../models/job-model";
import { ZodError } from "zod";
import { jobSchema, updateJobSchema } from "../validators/job-validator";
import User from "../models/user-model";
import Application from "../models/application-model";
import Company from "../models/company-model";

export const createJob = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const validateData = jobSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const job = await Job.create({
      ...validateData.data,
      createdBy: userId,
    });

    const populated = await job.populate("company", "name logo");

    res.status(201).json({ message: "Job posted successfully", job: populated });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const getJobsByRecruiter = async (req: Request, res: Response) => {
  try {
    const { recruiterId } = req.params;
    if (typeof recruiterId !== "string") {
      return res.status(400).json({ message: "Invalid recruiter ID" });
    }

    const jobs = await Job.find({ createdBy: recruiterId })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationsCount: count,
        };
      })
    );

    res.status(200).json({ jobs: jobsWithCount });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { keyword, location } = req.query;
    const query: any = { status: "open" };

    // If recruiter is logged in, show only their jobs
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (decode.role === "recruiter") {
          query.createdBy = decode.id;
        }
      } catch (error) {
        // Ignore invalid token for public listing
      }
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword as string, $options: "i" } },
        { description: { $regex: keyword as string, $options: "i" } },
      ];
    }

    if (location) {
      query.location = { $regex: location as string, $options: "i" };
    }

    const jobs = await Job.find(query)
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user.id;

    const validateData = updateJobSchema.safeParse(req.body);
    if (!validateData.success) {
      return res.status(400).json({
        message: validateData.error.issues[0]?.message || "Validation Error",
      });
    }

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const job = await Job.findByIdAndUpdate(jobId, validateData.data, {
      new: true,
    }).populate("company", "name logo");

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user.id;

    const existingJob = await Job.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate("company", "name logo description location website");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ job });
  } catch (error) {
    return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};

export const toggleSaveJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSaved = user.savedJobs.some(
      (id: any) => id.toString() === jobId,
    );

    if (isSaved) {
      // Remove from saved jobs
      user.savedJobs = user.savedJobs.filter(
        (id: any) => id.toString() !== jobId,
      );
    } else {
      // Add to saved jobs
      user.savedJobs.push(jobId as any);
    }
    await user.save();
    res.status(200).json({
      message: isSaved ? "Job removed from saved" : "Job saved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
     return res.status(error instanceof ZodError ? 400 : 500).json({
      message:
        error instanceof ZodError
          ? error.issues[0]?.message
          : "Internal Server Error",
    });
  }
};



export const getGlobalStats = async (req: Request, res: Response) => {
  try {
    const activeJobsCount = await Job.countDocuments({ status: "open" });
    const companiesCount = await Company.countDocuments();
    const jobSeekersCount = await User.countDocuments({ role: "jobseeker" });



    res.status(200).json({
      stats: {
        activeJobs: activeJobsCount,
        companies: companiesCount,
        jobSeekers: jobSeekersCount,
      },
    });
  } catch (error) {

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
