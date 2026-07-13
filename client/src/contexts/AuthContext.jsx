import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { STORAGE_KEYS, API_ENDPOINTS } from "@/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        // If parsing fails, clear storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  const isAuthenticated = useCallback(() => {
    return !!token && !!user;
  }, [token, user]);

  const login = useCallback(async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });

    const { token: newToken, id, role } = response.data;

    // Store token
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    setToken(newToken);

    // Store user data
    const userData = { id, email, role };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);

    return response.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin: user?.role === "Admin",
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
