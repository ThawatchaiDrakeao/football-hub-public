import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import {
  clearAuthData,
  getSavedToken,
  getSavedUser,
  saveAuthData,
} from "../utils/authStorage.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(getSavedToken);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setError("");
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem("footyHubUser", JSON.stringify(data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/login", { email, password });
      const { nextToken, nextUser } = saveAuthData(data);

      setToken(nextToken);
      setUser(nextUser);
      return nextUser;
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Login failed. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { nextToken, nextUser } = saveAuthData(data);

      setToken(nextToken);
      setUser(nextUser);
      return nextUser;
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    setError("");
    clearAuthData();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(token),
      loading,
      error,
    }),
    [user, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
