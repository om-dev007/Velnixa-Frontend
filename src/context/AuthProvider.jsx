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

            const success = res?.data?.success;
            const data = res?.data?.data;

            if (!success) throw new Error();

            setUser(data || null);

        } catch {
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
            const res = await loginUser(credentials);
            const success = res?.data?.success;
            const message = res?.data?.message;

            if (!success) throw new Error(message || "Login failed");

            await checkAuth();

            return { success: true, message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};