import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Login = () => {

    const navigate = useNavigate();

    const { user, login } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/user");
        }
    }, [user]);

    const [input, setInput] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const commonHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const formHandler = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {

            const res = await login(input);

            if (!res.success) {
                throw new Error(res.message);
            }

            showToast(res.message || "Login Successful!", "success");

            setTimeout(() => {
                navigate("/user");
            }, 1500);

        } catch (error) {

            showToast(
                error?.response?.data?.message || error.message || "Login Failed",
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Login | Velnixa</title>
            </Helmet>

            <Navbar />

            <div className="min-h-[80vh] bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4">

                <form
                    onSubmit={formHandler}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/5 px-6 py-8 sm:px-10 sm:py-10"
                >

                    <h1 className="text-3xl font-semibold text-center text-[#1F3D2B] mb-8">
                        Login
                    </h1>

                    <div className="space-y-6">

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[#4B5B52]">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={input.email}
                                onChange={commonHandler}
                                placeholder="Enter your email address"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">

                            <label className="text-sm font-medium text-[#4B5B52]">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={input.password}
                                onChange={commonHandler}
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                            />

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-[#2F6B4F] text-white py-3 rounded-lg font-medium"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <p className="text-sm text-center text-gray-500">
                            Don’t have an account?{" "}
                            <Link to="/register" className="text-[#2F6B4F] font-medium">
                                Register
                            </Link>
                        </p>

                    </div>

                </form>

                <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
                    {toasts.map((t) => (
                        <Toast key={t.id} message={t.message} type={t.type} />
                    ))}
                </div>

            </div>

            <Footer />
        </>
    );
};

export default Login;