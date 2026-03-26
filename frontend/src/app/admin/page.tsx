"use client";

import { useState, useEffect } from "react";
import api from "@/utils/axios";
import { 
  Users, 
  Briefcase, 
  FileText, 
  Building2,
  Activity,
  UserPlus,
  Send,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboardOverview() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/auth/admin-stats");
        if (response.data.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statItems = [
    { label: "Total Users", value: statsData?.stats.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Active Jobs", value: statsData?.stats.activeJobs || 0, icon: Briefcase, color: "text-green-500", bg: "bg-green-100" },
    { label: "Applications", value: statsData?.stats.totalApplications || 0, icon: FileText, color: "text-purple-500", bg: "bg-purple-100" },
    { label: "Total Company", value: statsData?.stats.totalCompanies || 0, icon: Building2, color: "text-orange-500", bg: "bg-orange-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>Updated just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Recent User Registrations</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {statsData?.recentActivity.users.length > 0 ? (
              statsData.recentActivity.users.map((user: any) => (
                <div key={user._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                      user.role === 'recruiter' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {format(new Date(user.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">No recent users</div>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center gap-2">
            <Send className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Job Applications</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {statsData?.recentActivity.applications.length > 0 ? (
              statsData.recentActivity.applications.map((app: any) => (
                <div key={app._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{app.applicant?.name || "Unknown"}</p>
                    <p className="text-[10px] text-gray-400">
                      {format(new Date(app.createdAt), "MMM d, h:mm a")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Applied for <span className="font-medium text-gray-700">{app.job?.title || "Deleted Job"}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">No recent applications</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

