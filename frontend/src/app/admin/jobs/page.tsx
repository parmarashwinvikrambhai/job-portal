"use client";

import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Loader2 } from "lucide-react";
import api from "@/utils/axios";
import toast from "react-hot-toast";

type Job = {
  _id: string;
  title: string;
  company: { _id: string; name: string };
  location: string;
  createdAt: string;
  applicationsCount: number;
  status: string;
};

type ApplicantDetails = {
  _id: string;
  name: string;
  email: string;
};

type Application = {
  _id: string;
  applicant: ApplicantDetails;
  status: string;
  createdAt: string;
  resume: string;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/jobs/admin/all');
      setJobs(response.data.jobs || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    setIsApplicationsLoading(true);
    try {
      const response = await api.get(`/api/applications/job/${jobId}`);
      setApplications(response.data.applications || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch applications");
    } finally {
      setIsApplicationsLoading(false);
    }
  };

  const openDeleteModal = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  const openViewModal = (job: Job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
    fetchApplications(job._id);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
    setApplications([]);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await api.delete(`/api/jobs/${jobToDelete._id}`);
      toast.success("Job deleted successfully");
      fetchJobs();
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Jobs</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-500 font-medium">No jobs found</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase font-medium bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Job Title</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 text-center">Applicants</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Posted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{job.company?.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-gray-500">{job.location}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-medium text-xs">
                          {job.applicationsCount || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        job.status === "open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openViewModal(job)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(job)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" 
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Job Confirmation Modal */}
      {isDeleteModalOpen && jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Job Posting</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete the job <span className="font-semibold text-gray-900">"{jobToDelete.title}"</span> at {jobToDelete.company?.name}? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteJob}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Applicants Modal */}
      {isViewModalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedJob.company?.name} • {selectedJob.location}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedJob.applicationsCount || 0} Total Applicants
              </span>
            </div>
            
            {/* Modal Body - Applicants List */}
            <div className="p-0 overflow-y-auto flex-1">
              {isApplicationsLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-500 text-sm">Loading applicants...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 text-sm">No applicants found for this job.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3">Applicant Name</th>
                      <th className="px-6 py-3">Applied</th>
                      <th className="px-6 py-3 text-right">Resume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-between">
                              <div>
                                  <p className="font-medium text-gray-900">{app.applicant?.name || "Unknown Applicant"}</p>
                                  <p className="text-xs text-gray-400">{app.applicant?.email || "No email"}</p>
                              </div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium capitalize ml-2 ${
                                  app.status === 'shortlisted' || app.status === 'accepted' || app.status === 'hired' ? 'bg-green-100 text-green-700' :
                                  app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-blue-100 text-blue-700'
                              }`}>
                                  {app.status}
                              </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {app.resume ? (
                            <a 
                              href={app.resume.startsWith("http") ? app.resume : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${app.resume}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                            >
                              View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">No Resume</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end shrink-0">
              <button 
                onClick={closeViewModal}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
