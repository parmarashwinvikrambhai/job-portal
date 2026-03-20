"use client";

import { 
  Users, 
  Briefcase, 
  FileText, 
  Building2,
  Activity
} from "lucide-react";

export default function AdminDashboardOverview() {
  // Placeholder Data
  const stats = [
    { label: "Total Users", value: "1,245", icon: Users, color: "text-blue-500", bg: "bg-blue-100" },
    { label: "Active Jobs", value: "342", icon: Briefcase, color: "text-green-500", bg: "bg-green-100" },
    { label: "Applications", value: "8,920", icon: FileText, color: "text-purple-500", bg: "bg-purple-100" },
    { label: "Total Company", value: "156", icon: Building2, color: "text-orange-500", bg: "bg-orange-100" },
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
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6 text-center text-gray-500 py-12">
            <p>Connect this to the backend API to show recent user registrations and job applications.</p>
        </div>
      </div>
    </div>
  );
}
