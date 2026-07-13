import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute, PublicRoute, routeConfig } from "@/routes";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/features/auth/LoginPage";

/**
 * Root application component.
 * Handles routing with authentication guards and renders
 * the appropriate layout (DashboardLayout for authenticated routes).
 */
function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "calc(var(--radius) - 2px)",
          },
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute isAuthenticated={isAuthenticated()}>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected routes with DashboardLayout */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated()}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {routeConfig
            .filter((route) => route.protected)
            .map(({ path, element: Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <Suspense
                    fallback={
                      <div className="flex items-center justify-center h-64">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                      </div>
                    }
                  >
                    <Component />
                  </Suspense>
                }
              />
            ))}
        </Route>
      </Routes>
    </>
  );
}

export default App;
