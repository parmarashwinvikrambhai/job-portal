"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";

export function StatsSection() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    companies: 0,
    jobSeekers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/jobs/stats/global");
        if (response.data && response.data.stats) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M+";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
    return num.toString();
  };

  return (
    <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-12">
      <div className="text-center">
        <div className="text-3xl font-bold text-foreground">
          {loading ? "..." : formatNumber(stats.activeJobs)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Active Jobs</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-foreground">
          {loading ? "..." : formatNumber(stats.companies)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Companies</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-foreground">
          {loading ? "..." : formatNumber(stats.jobSeekers)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Job Seekers</div>
      </div>
    </div>
  );
}
