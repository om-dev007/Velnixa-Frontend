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
                "http://localhost:5000/user/profile"
            );

            setUser(data.user);

        } catch (error) {
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

            const { data } = await axios.post(
                "http://localhost:5000/api/auth/login",
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
                "http://localhost:5000/api/auth/logout"
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