import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ModeToggle } from "@/components/layout/ModeToggle";
import { Outlet } from "react-router-dom";

/**
 * Main dashboard layout component.
 * Provides the sidebar navigation and header bar that wraps
 * all authenticated pages.
 */
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <main className="flex-1 p-4 transition-all">
        <div className="flex items-center justify-between mb-4">
          <SidebarTrigger />
          <ModeToggle />
        </div>

        <Outlet />
      </main>
    </div>
  );
}
