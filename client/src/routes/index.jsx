import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy-loaded page components for code splitting
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const DepartmentsPage = lazy(() => import("@/features/departments/DepartmentsPage"));
const EmployeeListPage = lazy(() => import("@/features/employees/EmployeeListPage"));
const LeavesPage = lazy(() => import("@/features/leaves/LeavesPage"));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));
const SettingsPage = lazy(() => import("@/features/settings/SettingsPage"));

/**
 * Protected route wrapper component.
 * Redirects unauthenticated users to the login page.
 */
export function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * Public route wrapper component.
 * Redirects authenticated users to the dashboard.
 */
export function PublicRoute({ children, isAuthenticated }) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

/**
 * Route configuration array.
 * Defines all application routes with their corresponding components.
 */
export const routeConfig = [{
    path: "/",
    element: DashboardPage,
    protected: true,
  },
  {
    path: "/departments",
    element: DepartmentsPage,
    protected: true,
  },
  {
    path: "/employees",
    element: EmployeeListPage,
    protected: true,
  },
  {
    path: "/leaves",
    element: LeavesPage,
    protected: true,
  },
  {
    path: "/settings",
    element: SettingsPage,
    protected: true,
  },
  {
    path: "/profile",
    element: ProfilePage,
    protected: true,
  },
];
