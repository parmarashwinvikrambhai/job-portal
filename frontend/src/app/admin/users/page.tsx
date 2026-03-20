"use client";

import { useState } from "react";
import { Search, Edit2, Trash2, X } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
};

export default function AdminUsersPage() {
  // Placeholder Data
  const [users, setUsers] = useState([
    { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Job Seeker", status: "Active", joinedAt: "Oct 24, 2023" },
    { id: 2, name: "Bob Jones", email: "bob@techcorp.com", role: "Recruiter", status: "Active", joinedAt: "Nov 12, 2023" },
    { id: 3, name: "Charlie Day", email: "charlie@gmail.com", role: "Job Seeker", status: "Inactive", joinedAt: "Jan 05, 2024" },
    { id: 4, name: "Diana Prince", email: "diana@amazon.com", role: "Recruiter", status: "Active", joinedAt: "Feb 18, 2024" },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Update the local state to reflect UI changes (in a real app, this calls the backend)
    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
    closeEditModal();
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    // Remove from local state
    setUsers(users.filter(u => u.id !== userToDelete.id));
    closeDeleteModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manage Users</h2>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase font-medium bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Recruiter" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{user.joinedAt}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit User"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(user)}
                      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing 4 to 4 of {users.length} entries</span>
            {/* Pagination Placeholder */}
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50">Prev</button>
                <button className="px-3 py-1 border border-gray-200 rounded bg-gray-50">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded disabled:opacity-50">Next</button>
            </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Edit User Details</h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveChanges} className="p-6 space-y-4">
              {/* Read-only info */}
              <div className="space-y-1 mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{selectedUser.name}</p>
                <p className="text-xs text-gray-500">{selectedUser.email}</p>
                <p className="text-xs text-gray-500">Joined: {selectedUser.joinedAt}</p>
              </div>

              {/* Editable Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Account Role</label>
                <select 
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Admin">Admin</option>
                </select>
                <p className="text-[10px] text-gray-500">Changes the user's dashboard access.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Account Status</label>
                <select 
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({...selectedUser, status: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Banned">Banned</option>
                </select>
                <p className="text-[10px] text-gray-500">Suspended/Banned users cannot log in.</p>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User Account</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{userToDelete.name}</span>? 
                This action cannot be undone and will permanently remove their data from the database.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
