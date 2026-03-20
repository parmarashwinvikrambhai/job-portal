"use client";

import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  postedAt: string;
  applicants: number;
  status: string;
};

type Applicant = {
  id: string;
  name: string;
  email: string;
  appliedDate: string;
  status: string;
};

export default function AdminJobsPage() {
  // Placeholder Data
  const [jobs, setJobs] = useState([
    { id: "J101", title: "Frontend Developer", company: "TechCorp Inc.", location: "Remote", postedAt: "2 days ago", applicants: 45, status: "Active" },
    { id: "J102", title: "Senior UI/UX Designer", company: "DesignStudio", location: "New York, NY", postedAt: "5 days ago", applicants: 12, status: "Active" },
    { id: "J103", title: "Backend Engineer", company: "DataFlow", location: "San Francisco, CA", postedAt: "1 week ago", applicants: 89, status: "Closed" },
    { id: "J104", title: "Product Manager", company: "Innovate LLC", location: "Chicago, IL", postedAt: "2 weeks ago", applicants: 120, status: "Active" },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Generate Dummy Applicants based on the job's total applicant count
  const getDummyApplicants = (count: number): Applicant[] => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `A${i + 1}`,
      name: `Applicant Name ${i + 1}`,
      email: `applicant${i + 1}@example.com`,
      appliedDate: `${Math.floor(Math.random() * 10) + 1} days ago`,
      status: i % 3 === 0 ? "Under Review" : i % 5 === 0 ? "Shortlisted" : "Pending",
    }));
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
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
  };

  const handleDeleteJob = () => {
    if (!jobToDelete) return;

    // Remove from local state
    setJobs(jobs.filter(j => j.id !== jobToDelete.id));
    closeDeleteModal();
  };

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
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
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
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{job.title}</div>
                    <div className="text-xs text-gray-400">ID: {job.id}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{job.company}</td>
                  <td className="px-6 py-4 text-gray-500">{job.location}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-medium text-xs">
                        {job.applicants}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{job.postedAt}</td>
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
                Are you sure you want to delete the job <span className="font-semibold text-gray-900">"{jobToDelete.title}"</span> at {jobToDelete.company}? 
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedJob.company} • {selectedJob.location}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedJob.applicants} Total Applicants
              </span>
            </div>
            
            {/* Modal Body - Applicants List */}
            <div className="p-0 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Applicant Name</th>
                    <th className="px-6 py-3">Applied</th>
                    <th className="px-6 py-3 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getDummyApplicants(selectedJob.applicants).map((applicant) => (
                    <tr key={applicant.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">{applicant.name}</p>
                                <p className="text-xs text-gray-400">{applicant.email}</p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                                applicant.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                                applicant.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                                {applicant.status}
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{applicant.appliedDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                          View PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end">
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
