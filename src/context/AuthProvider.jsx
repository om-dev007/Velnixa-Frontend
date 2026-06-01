import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getProfile } from "../api/user.api";
import {
  loginUser,
  logoutUser,
} from "../api/auth.api";

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {

    try {

      const res = await getProfile();

      setUser(res.data.data);

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

  const login = async (credentials) => {

    try {

      const res =
        await loginUser(credentials);

        console.log("Response in authProvider.jsx: ", res);

      if (!res.data.success) {
        throw new Error(
          res.data.message
        );
      }

      localStorage.setItem(
        "accessToken",
        res.data.data.accessToken
      );

      await checkAuth();

      return {
        success: true,
        message: res.data.message,
      };

    } catch (error) {

      return {
        success: false,
        message: error.message,
      };
    }
  };

  const logout = async () => {

    try {

      await logoutUser();

      localStorage.removeItem(
        "accessToken"
      );

      setUser(null);

    } catch (error) {

      return {
        success: false,
        message: error.message,
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