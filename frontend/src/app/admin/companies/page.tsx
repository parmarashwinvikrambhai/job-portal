"use client";

import { useState } from "react";
import { Search, Eye, Trash2, X, Building2, Edit2 } from "lucide-react";

type Company = {
  id: string;
  name: string;
  industry: string;
  location: string;
  jobsPosted: number;
  status: string;
  joinedAt: string;
};

export default function AdminCompaniesPage() {
  // Dummy Companies Data
  const [companies, setCompanies] = useState<Company[]>([
    { id: "C1", name: "TechCorp Inc.", industry: "Technology", location: "San Francisco, CA", jobsPosted: 12, status: "Verified", joinedAt: "Oct 15, 2023" },
    { id: "C2", name: "DesignStudio", industry: "Design", location: "New York, NY", jobsPosted: 4, status: "Verified", joinedAt: "Nov 02, 2023" },
    { id: "C3", name: "DataFlow", industry: "Data Science", location: "Remote", jobsPosted: 8, status: "Pending", joinedAt: "Jan 10, 2024" },
    { id: "C4", name: "Innovate LLC", industry: "Manufacturing", location: "Chicago, IL", jobsPosted: 2, status: "Suspended", joinedAt: "Feb 22, 2024" },
  ]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);

  const openDeleteModal = (company: Company) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCompanyToDelete(null);
  };

  const openViewModal = (company: Company) => {
    setSelectedCompany(company);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedCompany(null);
  };

  const openEditModal = (company: Company) => {
    setCompanyToEdit(company);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCompanyToEdit(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyToEdit) return;

    setCompanies(companies.map(c => c.id === companyToEdit.id ? companyToEdit : c));
    closeEditModal();
  };

  const handleDeleteCompany = () => {
    if (!companyToDelete) return;
    setCompanies(companies.filter(c => c.id !== companyToDelete.id));
    closeDeleteModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Companies</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search companies..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase font-medium bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Company Name</th>
                <th className="px-6 py-4">Industry & Location</th>
                <th className="px-6 py-4 text-center">Jobs Posted</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4 text-gray-500" />
                      </div>
                      {company.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{company.industry}</p>
                    <p className="text-xs text-gray-500">{company.location}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-600">
                    {company.jobsPosted}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.status === "Verified" ? "bg-green-100 text-green-700" : 
                      company.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                      "bg-red-100 text-red-700"
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{company.joinedAt}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openViewModal(company)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" 
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openEditModal(company)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" 
                      title="Edit Status"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(company)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" 
                      title="Remove Company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No companies found.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Company Details Modal */}
      {isViewModalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCompany.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCompany.industry}</p>
                 </div>
              </div>
              <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Company Information</h4>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                selectedCompany.status === "Verified" ? "bg-green-100 text-green-700" : 
                                selectedCompany.status === "Pending" ? "bg-yellow-100 text-yellow-700" : 
                                "bg-red-100 text-red-700"
                            }`}>
                                {selectedCompany.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Location</p>
                            <p className="text-sm font-medium text-gray-900">{selectedCompany.location}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Registered Since</p>
                            <p className="text-sm font-medium text-gray-900">{selectedCompany.joinedAt}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Active Jobs</p>
                            <p className="text-sm font-medium text-gray-900">{selectedCompany.jobsPosted} Positions</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Admin Note:</strong> This is a {selectedCompany.status.toLowerCase()} employer profile. Ensure all required compliance documents are reviewed before verifying new listings.
                    </p>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={closeViewModal}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Company Confirmation Modal */}
      {isDeleteModalOpen && companyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Company Account</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to completely remove <span className="font-semibold text-gray-900">"{companyToDelete.name}"</span>? 
                This will also delete their <strong>{companyToDelete.jobsPosted} active job postings</strong> and all associated data.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteCompany}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Company Status Modal */}
      {isEditModalOpen && companyToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Update Company Status</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
              {/* Read-only info */}
              <div className="space-y-1 mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-gray-600" />
                 </div>
                 <div>
                    <p className="text-sm font-medium text-gray-900">{companyToEdit.name}</p>
                    <p className="text-xs text-gray-500">{companyToEdit.industry} • {companyToEdit.location}</p>
                 </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Verification Status</label>
                <select 
                  value={companyToEdit.status}
                  onChange={(e) => setCompanyToEdit({...companyToEdit, status: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending (Under Review)</option>
                  <option value="Verified">Verified (Approved)</option>
                  <option value="Suspended">Suspended (Blocked)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  <strong>Verified:</strong> Company can post jobs publicly. <br/>
                  <strong>Pending/Suspended:</strong> Company's jobs are hidden from Job Seekers.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
