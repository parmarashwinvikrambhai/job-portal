"use client";

import { BarChart3, Download, Calendar } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">System Reports</h2>
        
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Last 30 Days</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
            </button>
        </div>
      </div>

      {/* Main Charts Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-80 flex flex-col items-center justify-center text-gray-400">
            <BarChart3 className="w-12 h-12 mb-4 text-gray-300" />
            <p className="font-medium text-gray-600">User Growth Chart</p>
            <p className="text-sm mt-1 text-center">Integration with Recharts or Chart.js needed here to visualize daily active users over time.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-80 flex flex-col items-center justify-center text-gray-400">
            <BarChart3 className="w-12 h-12 mb-4 text-gray-300" />
            <p className="font-medium text-gray-600">Jobs by Category</p>
            <p className="text-sm mt-1 text-center">Visualize which job categories are most popular on the platform.</p>
        </div>

      </div>

    </div>
  );
}
