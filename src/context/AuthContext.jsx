import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    axios.defaults.withCredentials = true;

    const checkAuth = async () => {
        try {

            const { data } = await axios.get(
                "https://velnixa-backend.onrender.com/user/profile"
            );

            setUser(data.user);

        } catch (error) {
            setUser(null);
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {

            const { data } = await axios.post(
                "https://velnixa-backend.onrender.com/api/auth/login",
                credentials
            );

            setUser(data.user);

            return {
                success: true,
                message: data.message
            };

        } catch (error) {

            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };

        }
    };

    const logout = async () => {
        try {

            await axios.post(
                "https://velnixa-backend.onrender.com/api/auth/logout"
            );

            setUser(null);

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);