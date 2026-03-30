"use client";

import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Download, Calendar, Loader2, BarChart3, TrendingUp, Users, Briefcase } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import api from "@/utils/axios";

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/reports/stats?days=${days}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [days]);

  const handleExportExcel = () => {
    if (!data) return;

    // Prepare CSV data for User Growth
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Date/Label,Count\n";
    
    data.userGrowth.forEach((item: any) => {
      csvContent += `User Growth,${item.date},${item.users}\n`;
    });

    data.jobsByType.forEach((item: any) => {
      csvContent += `Job Category,${item.name},${item.jobs}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_report_${days}_days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-500 font-medium">Loading system reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">System Reports</h2>
          <p className="text-gray-500 mt-1">Monitor platform performance and growth metrics.</p>
        </div>
        
        <div className="flex gap-3">
            <Select value={days} onValueChange={setDays}>
              <SelectTrigger className="w-[160px] h-10 bg-white border-gray-200">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>

            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all active:scale-95"
            >
                <Download className="w-4 h-4" />
                <span>Export Excel</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                  <div>
                      <p className="text-sm font-medium text-gray-500">Total New Users</p>
                      <h4 className="text-2xl font-bold mt-1 text-gray-900">
                        {data?.userGrowth.reduce((acc: number, curr: any) => acc + curr.users, 0)}
                      </h4>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                  <div>
                      <p className="text-sm font-medium text-gray-500">Total Jobs Active</p>
                      <h4 className="text-2xl font-bold mt-1 text-gray-900">
                        {data?.jobsByType.reduce((acc: number, curr: any) => acc + curr.jobs, 0)}
                      </h4>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-indigo-600" />
                  </div>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                  <div>
                      <p className="text-sm font-medium text-gray-500">Growth Rate</p>
                      <h4 className="text-2xl font-bold mt-1 text-emerald-600">+12.5%</h4>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
                   <p className="text-sm text-gray-500">Daily registrations in last {days} days</p>
                </div>
                <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.userGrowth}>
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => value.split('-').slice(1).join('/')}
                            tick={{ fill: '#64748b' }}
                            tickMargin={10}
                        />
                        <YAxis 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: '#64748b' }}
                            tickMargin={10}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #f1f5f9', 
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }} 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="users" 
                            stroke="#3b82f6" 
                            strokeWidth={3} 
                            strokeDasharray="5 5"
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6, strokeWidth: 0 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Jobs by Type</h3>
                    <p className="text-sm text-gray-500">Distribution of current job listings</p>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.jobsByType} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="name" 
                            type="category" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: '#1e293b', fontWeight: 500 }}
                        />
                        <YAxis 
                            type="number" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tick={{ fill: '#64748b' }}
                        />
                        <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                border: '1px solid #f1f5f9', 
                                borderRadius: '12px',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                            }} 
                        />
                        <Bar dataKey="jobs" radius={[6, 6, 0, 0]} barSize={40}>
                            {data?.jobsByType.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}
