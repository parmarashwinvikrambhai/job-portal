import { Request, Response } from "express";
import User from "../models/user-model";
import Job from "../models/job-model";

export const getReportsStats = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;

    // 1. User Growth (Dynamic range)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Jobs by Type (Visualizing job types as categories)
    const jobsByType = await Job.aggregate([
      {
        $group: {
          _id: "$jobType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      userGrowth: userGrowth.map((item) => ({ 
        date: item._id, 
        users: item.count 
      })),
      jobsByType: jobsByType.map((item) => ({ 
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1), 
        jobs: item.count 
      })),
    });
  } catch (error) {
    console.error("Reports Stats Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
