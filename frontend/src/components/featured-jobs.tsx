"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { setAllJobs } from "@/lib/features/jobs/jobs-slice";
import { JobCard } from "@/components/job-card";
import api from "@/utils/axios";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedJobs() {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get("/api/jobs");
        if (response.data && response.data.jobs) {
          dispatch(setAllJobs(response.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[200px] w-full rounded-xl border border-border p-6 space-y-4">
             <div className="flex items-center gap-4">
               <Skeleton className="h-12 w-12 rounded-xl" />
               <div className="space-y-2">
                 <Skeleton className="h-4 w-[200px]" />
                 <Skeleton className="h-4 w-[150px]" />
               </div>
             </div>
             <Skeleton className="h-20 w-full" />
             <div className="flex justify-between items-center">
               <Skeleton className="h-8 w-24" />
               <Skeleton className="h-10 w-32" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-2xl">
        <p className="text-muted-foreground">No jobs found at the moment. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {jobs.slice(0, 6).map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
