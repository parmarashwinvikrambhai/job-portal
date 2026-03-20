"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  X,
  User,
  Briefcase,
  Building2,
  LogOut,
  LayoutDashboard,
  Heart,
  Settings,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { logout, setApplications } from "@/lib/features/auth/auth-slice";
import toast from "react-hot-toast";
import api from "@/utils/axios";

export function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user && user.role === "jobseeker") {
      const fetchApplications = async () => {
        try {
          const response = await api.get("/api/applications/user");
          const apps = response.data.applications || [];
          const formattedApps = apps.map((app: any) => ({
            id: app._id,
            jobId: app.job?._id || "",
            jobTitle: app.job?.title || "Unknown Job",
            company: app.job?.company?.name || "Unknown Company",
            appliedDate: new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            status: app.status,
            coverLetter: app.coverLetter,
          }));
          dispatch(setApplications(formattedApps));
        } catch (error) {
          console.error("Failed to fetch applications in Navigation:", error);
        }
      };
      fetchApplications();
    }
  }, [user, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight">JobHub</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {user ? (
              <Link
                href={user.role === "recruiter" ? "/recruiter" : "/dashboard"}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            ) : null}
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {user?.role === "recruiter" ? "Job List" : "Find Jobs"}
            </Link>
            {user?.role === "recruiter" && (
              <Link
                href="/recruiter"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Post Jobs
              </Link>
            )}
          </nav>
        </div>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-md mx-8 md:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs, companies..."
              className="pl-9 bg-secondary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start mr-1">
                    <span className="text-sm font-semibold max-w-30 truncate leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border p-4 md:hidden">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs, companies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <nav className="flex flex-col gap-3">
            <Link
              href="/jobs"
              className="text-sm font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {user?.role === "recruiter" ? "Job List" : "Find Jobs"}
            </Link>
            {user ? (
              <>
                <Link
                  href={
                    user.role === "jobseeker" ? "/dashboard" : "/recruiter"
                  }
                  className="text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-left text-destructive"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
