// src/context/AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getProfile } from "../api/user.api";
import { loginUser, logoutUser } from "../api/auth.api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await getProfile();
      if (res.data?.success) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // src/context/AuthProvider.jsx (Sirf login function change karo)
  const login = async (credentials) => {

    try {
      const response = await loginUser(credentials);

      // ✅ Check karo response ka data
      if (!response.data.success) {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }

      localStorage.setItem("accessToken", response.data.data.accessToken);
      await checkAuth();

      return {
        success: true,
        message: response.data.message || "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "An unexpected error occurred",
      };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("accessToken");
      setUser(null);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};