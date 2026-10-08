import { lazy, Suspense } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "./utils/authUtils";
import NavBar from "./components/common/NavBar";
import { Toaster } from "sonner";
import AppLoader from "./components/common/AppLoader";

// Landing views (home & auth)
const HomeView = lazy(() => import("./views/HomeView"));
const LoginView = lazy(() => import("./views/auth/LoginView"));
const RegisterView = lazy(() => import("./views/auth/RegisterView"));

// App views
const AppLayout = lazy(() => import("./components/app/AppLayout"));
const DashboardView = lazy(() => import("./views/app/DashboardView"));
const TransferencesView = lazy(() => import("./views/app/TransferencesView"));
const CreditsView = lazy(() => import("./views/app/CreditsView"));
const AdminView = lazy(() => import("./views/app/AdminView"));

const AuthGuard = ({ children }) => {
  const user = getCurrentUser();
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

const AdminGuard = ({ children }) => {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }
  return children;
};

const Router = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<AppLoader text="Cargando..." />}>
      <NavBar key={location.pathname + location.search} />
      <Routes>
        {/* Landing (home & auth) */}
        <Route path="/" index element={<HomeView />} />
        <Route path="/auth/login" element={<LoginView />} />
        <Route path="/auth/register" element={<RegisterView />} />

        {/* App */}
        <Route path="/app" element={<AuthGuard><AppLayout /></AuthGuard>}>
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="transferences" element={<TransferencesView />} />
          <Route path="credits" element={<CreditsView />} />
          <Route path="admin" element={<AdminGuard><AdminView /></AdminGuard>} />

          {/* NOT FOUND */}
          <Route path="*" element={<h1>ERROR 404, NOT FOUND (ON APP)</h1>} />
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<h1>ERROR 404, NOT FOUND</h1>} />
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast:   'custom-toast',
            success: 'custom-toast--success',
            error:   'custom-toast--error',
          }
        }}
      />
    </Suspense>
  )
}

export default Router