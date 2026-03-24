"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2,
  LayoutDashboard, 
  Users, 
  Briefcase,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { logout } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/axios";

export function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      dispatch(logout());
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error logging out");
      dispatch(logout());
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manage Users", href: "/admin/users", icon: Users },
    { label: "Manage Jobs", href: "/admin/jobs", icon: Briefcase },
    { label: "Manage Companies", href: "/admin/companies", icon: Building2 },
    { label: "Reports", href: "/admin/reports", icon: FileText },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 text-white flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <Building2 className="w-8 h-8 text-blue-500 shrink-0" />
        <div className="flex flex-col">
           <span className="text-xl font-bold leading-tight">
             <span className="text-blue-500">Job</span>Hub
           </span>
           <span className="text-sm text-gray-400 font-medium">Admin Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
