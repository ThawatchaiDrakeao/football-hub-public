export const getProtectedRouteDecision = ({ isAuthenticated, loading }) => {
  if (loading) {
    return "loading";
  }

  return isAuthenticated ? "allow" : "login";
};

export const getAdminRouteDecision = ({ isAuthenticated, loading, user }) => {
  const protectedDecision = getProtectedRouteDecision({
    isAuthenticated,
    loading,
  });

  if (protectedDecision !== "allow") {
    return protectedDecision;
  }

  return user?.role === "admin" ? "allow" : "home";
};
