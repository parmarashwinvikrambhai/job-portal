"use client";

import { useEffect, useState } from "react";
import api from "@/utils/axios";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { setAllJobs } from "@/lib/features/jobs/jobs-slice";
import { Job } from "@/components/job-card";
import { useSearchParams } from "next/navigation";

const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
const experienceLevels = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead",
  "Executive",
];
const salaryRanges = [
  "$50k - $80k",
  "$80k - $120k",
  "$120k - $160k",
  "$160k - $200k",
  "$200k+",
];

export default function JobsPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { jobs } = useSelector((state: RootState) => state.jobs);
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("keyword") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [selectedSalary, setSelectedSalary] = useState("");

  const fetchJobs = async (params = {}) => {
    try {
      const response = await api.get("/api/jobs", { params });
      if (response.data.jobs) {
        dispatch(setAllJobs(response.data.jobs));
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    const loc = searchParams.get("location") || "";
    fetchJobs({ keyword, location: loc });
  }, [searchParams]);

  const handleSearch = () => {
    fetchJobs({
      keyword: searchQuery,
      location: location,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleExperience = (level: string) => {
    setSelectedExperience((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedExperience([]);
    setSelectedSalary("");
  };

  const hasFilters =
    selectedTypes.length > 0 || selectedExperience.length > 0 || selectedSalary;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Job Type */}
      <div>
        <h3 className="font-semibold mb-3">Job Type</h3>
        <div className="space-y-2.5">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center gap-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
              />
              <Label
                htmlFor={`type-${type}`}
                className="text-sm font-normal cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <h3 className="font-semibold mb-3">Experience Level</h3>
        <div className="space-y-2.5">
          {experienceLevels.map((level) => (
            <div key={level} className="flex items-center gap-2">
              <Checkbox
                id={`exp-${level}`}
                checked={selectedExperience.includes(level)}
                onCheckedChange={() => toggleExperience(level)}
              />
              <Label
                htmlFor={`exp-${level}`}
                className="text-sm font-normal cursor-pointer"
              >
                {level}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <h3 className="font-semibold mb-3">Salary Range</h3>
        <Select value={selectedSalary} onValueChange={setSelectedSalary}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {salaryRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear Filters
        </Button>                                                                             
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navigation />

      <main className="flex-1">
        {/* Search Header */}
        <section className="bg-background border-b border-border py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 h-12"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="City or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-12 h-12"
                />
              </div>
              <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
                Search
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 lg:hidden"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </section>

        {/* Jobs Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Sidebar Filters - Desktop */}
              <aside className="hidden lg:block w-72 shrink-0">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FilterContent />
                  </CardContent>
                </Card>
              </aside>

              {/* Job Listings */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold">All Jobs</h1>
                    <p className="text-muted-foreground mt-1">
                      {jobs.length} jobs found
                    </p>
                  </div>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="relevant">Most Relevant</SelectItem>
                      <SelectItem value="salary-high">
                        Salary: High to Low
                      </SelectItem>
                      <SelectItem value="salary-low">
                        Salary: Low to High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
