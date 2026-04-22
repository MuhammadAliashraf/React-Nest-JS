import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUIStore } from "@/store/uiStore";

/**
 * AdminLayout — the shell wrapping all protected admin pages.
 * Renders Sidebar on the left, Topbar at top, and Outlet as the main content.
 */
const AdminLayout = () => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-60" : "ml-16"}`}
      >
        <Topbar />
        <main className="flex-1 pt-20 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
