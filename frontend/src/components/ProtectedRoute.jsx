import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getProtectedRouteDecision } from "../utils/routeAccess.js";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const decision = getProtectedRouteDecision({ isAuthenticated, loading });

  if (decision === "loading") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-slate-300">
        Checking your session...
      </div>
    );
  }

  if (decision === "login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
