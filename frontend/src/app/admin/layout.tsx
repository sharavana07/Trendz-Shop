import AdminNavbar from "@/components/AdminNavbar";
import ProtectedAdminRoute from "@/components/ProtectedAdminRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen flex flex-col">
        <AdminNavbar />
        <main className="flex-1 p-6 bg-black/20 text-white">{children}</main>
      </div>
    </ProtectedAdminRoute>
  );
}
