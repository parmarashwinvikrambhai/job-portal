import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { featuredJobs, recruiterJobs } from "@/lib/mock-data";
import { Job } from "@/components/job-card";

interface JobsState {
  jobs: Job[];
  recruiterJobsList: any[];
  pagination: {
    totalJobs: number;
    totalPages: number;
    currentPage: number;
  };
  recruiterPagination: {
    totalJobs: number;
    totalPages: number;
    currentPage: number;
  } | null;
}

const initialState: JobsState = {
  jobs: [],
  recruiterJobsList: [],
  pagination: {
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1,
  },
  recruiterPagination: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setAllJobs: (
      state,
      action: PayloadAction<any[] | { jobs: any[]; totalJobs?: number; totalPages?: number; currentPage?: number }>,
    ) => {
      const payload = Array.isArray(action.payload) ? { jobs: action.payload } : action.payload;

      state.jobs = payload.jobs.map((job) => ({
        id: job._id,
        title: job.title,
        company: job.company?.name || "Unknown Company",
        companyLogo: job.company?.logo,
        location: job.location,
        salary: (() => {
          const s = job.salary;
          if (!s) return "Not Disclosed";
          const sym: Record<string, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };
          const c = sym[s.currency] || s.currency + " ";
          if (s.min > 0 && s.max > 0) return `${c}${s.min} - ${c}${s.max}`;
          if (s.min > 0) return `${c}${s.min}+`;
          if (s.max > 0) return `Up to ${c}${s.max}`;
          return "Not Disclosed";
        })(),
        type: job.jobType,
        posted: new Date(job.createdAt).toLocaleDateString(),
        skills: job.skillsRequired || [],
        description: job.description,
        experience: job.experience,
      }));

      if (payload.totalJobs !== undefined) state.pagination.totalJobs = payload.totalJobs;
      if (payload.totalPages !== undefined) state.pagination.totalPages = payload.totalPages;
      if (payload.currentPage !== undefined) state.pagination.currentPage = payload.currentPage;
    },
    updateJob: (state, action: PayloadAction<Job>) => {
      const updatedJob = action.payload;
      state.jobs = state.jobs.map((job) =>
        job.id === updatedJob.id ? updatedJob : job,
      );
      // Sync with recruiter list
      state.recruiterJobsList = state.recruiterJobsList.map((job) =>
        job._id === updatedJob.id
          ? {
              ...job,
              title: updatedJob.title,
              location: updatedJob.location,
              jobType: updatedJob.type,
              status: job.status, // Keep status
              applicationsCount: job.applicationsCount, // Keep applicants
            }
          : job,
      );
    },
    setRecruiterJobs: (state, action: PayloadAction<any[] | any>) => {
      if (Array.isArray(action.payload)) {
        state.recruiterJobsList = action.payload;
        state.recruiterPagination = null;
      } else {
        state.recruiterJobsList = action.payload.jobs;
        state.recruiterPagination = {
          totalJobs: action.payload.totalJobs,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
        };
      }
    },
    addJob: (state, action: PayloadAction<any>) => {
      const newJob = action.payload;
      state.recruiterJobsList = [newJob, ...state.recruiterJobsList];

      const featuredFormattedVersion: Job = {
        id: newJob._id,
        title: newJob.title,
        company: "TechCorp Inc.",
        location: newJob.location,
        salary: "$100k - $150k",
        type: newJob.type,
        posted: "Just now",
        skills: ["React", "TypeScript"],
        description: newJob.description || "",
        experience: newJob.experience,
      };
      state.jobs = [featuredFormattedVersion, ...state.jobs];
    },
    updateRecruiterJob: (state, action: PayloadAction<any>) => {
      const updatedJob = action.payload;
      state.recruiterJobsList = state.recruiterJobsList.map((job) =>
        job._id === updatedJob._id ? updatedJob : job,
      );
      // Sync back to featuredJobs
      state.jobs = state.jobs.map((job) =>
        job.id === updatedJob._id
          ? {
              ...job,
              title: updatedJob.title,
              location: updatedJob.location,
              type: updatedJob.type,
              experience: updatedJob.experience,
              description: updatedJob.description,
            }
          : job,
      );
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      const jobId = action.payload;
      state.recruiterJobsList = state.recruiterJobsList.filter(
        (job) => job._id !== jobId,
      );
      state.jobs = state.jobs.filter((job) => job.id !== jobId);
    },
  },
});

export const { updateJob, setRecruiterJobs, addJob, updateRecruiterJob, deleteJob, setAllJobs } = jobsSlice.actions;
export default jobsSlice.reducer;
