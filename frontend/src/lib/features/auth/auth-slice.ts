import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/axios";
import toast from "react-hot-toast";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "jobseeker" | "recruiter" | "admin";
  company?: string;
  avatar?: string;
  title?: string;
  location?: string;
  skills?: string[];
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "accepted" | "rejected";
  coverLetter?: string;
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  savedDate?: string;
}

export const toggleSaveJobAsync = createAsyncThunk(
  "auth/toggleSaveJob",
  async (job: any, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/jobs/toggle-save-job/${job._id || job.id}`);
      return { job, message: response.data.message, savedJobsIds: response.data.savedJobs };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle save job");
    }
  }
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  applications: Application[];
  savedJobs: any[];
}

// Helper to get user from localStorage safely
const getUserFromStorage = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  isLoading: false,
  error: null,
  applications: [],
  savedJobs: getUserFromStorage()?.savedJobs || [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload?.savedJobs) {
        state.savedJobs = action.payload.savedJobs;
      }
      if (typeof window !== "undefined") {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      state.applications = [];
      state.savedJobs = [];
    },
    addApplication: (
      state,
      action: PayloadAction<Omit<Application, "id" | "appliedDate" | "status">>,
    ) => {
      const newApp: Application = {
        ...action.payload,
        id: Date.now().toString(),
        appliedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: "pending",
      };
      state.applications = [newApp, ...state.applications];
    },
    saveJob: (state, action: PayloadAction<Omit<SavedJob, "savedDate">>) => {
      const newSavedJob: SavedJob = {
        ...action.payload,
        savedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };
      state.savedJobs = [newSavedJob, ...state.savedJobs];
    },
    removeSavedJob: (state, action: PayloadAction<string>) => {
      state.savedJobs = state.savedJobs.filter((j) => (j._id || j.id) !== action.payload);
      if (typeof window !== "undefined" && state.user) {
        const updatedUser = { ...state.user, savedJobs: state.savedJobs };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleSaveJobAsync.fulfilled, (state, action: PayloadAction<any>) => {
        const { job, message } = action.payload;
        const jobIdentifier = job._id || job.id;
        
        const isCurrentlySaved = state.savedJobs.find(j => (j._id || j.id) === jobIdentifier);
        
        if (isCurrentlySaved) {
          state.savedJobs = state.savedJobs.filter(j => (j._id || j.id) !== jobIdentifier);
          toast.success("Job removed from saved");
        } else {
          state.savedJobs = [job, ...state.savedJobs];
          toast.success("Job saved successfully");
        }

        if (typeof window !== "undefined" && state.user) {
          const updatedUser = { ...state.user, savedJobs: state.savedJobs };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          state.user = updatedUser;
        }
      })
      .addCase(toggleSaveJobAsync.rejected, (state, action: PayloadAction<any>) => {
        toast.error(action.payload as string);
      });
  },
});

export const { setUser, logout, addApplication, saveJob, removeSavedJob } =
  authSlice.actions;
export default authSlice.reducer;
