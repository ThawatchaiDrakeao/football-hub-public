import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getAdminRouteDecision } from "../utils/routeAccess.js";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const decision = getAdminRouteDecision({ isAuthenticated, loading, user });

  if (decision === "loading") {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-slate-300">
        Checking admin access...
      </div>
    );
  }

  if (decision === "login") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (decision === "home") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
