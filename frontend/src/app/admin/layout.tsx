import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - fixed width */}
      <AdminSidebar />

      {/* Main Content Area - takes remaining space and offsets for fixed sidebar */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Simple Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 shadow-sm justify-between">
            <h1 className="text-xl font-semibold text-gray-800">System Administration</h1>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Welcome, Super Admin</span>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    A
                </div>
            </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
