import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {

    const { user } = useAuth();

    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

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

    useEffect(() => {
        if (user) {
            showToast("Please logout first before creating another account", "error");

            setTimeout(() => {
                navigate("/user");
            }, 1500);
        }
    }, [user]);

    const formHandler = async (e) => {

        e.preventDefault();

        if (user) {
            showToast("Please logout first before creating another account", "error");
            return;
        }

        try {

            setLoading(true);

            const res = await axios.post(
                "https://velnixa-backend.vercel.app/api/auth/register",
                input
            );

            showToast(res.data.message || "Account Created!", "success");

            setInput({
                name: "",
                email: "",
                password: "",
            });

            if (res.status === 201) {
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }

        } catch (error) {

            showToast(
                error.response?.data?.message || "Registration Failed",
                "error"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <Helmet>
                <title>Register | Velnixa</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <Navbar />

            <div className="min-h-[80vh] bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4">

                <form
                    onSubmit={formHandler}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-black/5 px-6 py-8 sm:px-10 sm:py-10"
                >

                    <h1 className="text-3xl font-semibold text-center text-[#1F3D2B] mb-8">
                        Register
                    </h1>

                    <div className="space-y-6">

                        <input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={commonHandler}
                            placeholder="Full Name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                        />

                        <input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={commonHandler}
                            placeholder="Email Address"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                        />

                        <input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={commonHandler}
                            placeholder="Password"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 bg-[#2F6B4F] text-white py-3 rounded-lg font-medium hover:bg-[#24563F] transition-all cursor-pointer"
                        >
                            {loading ? "Creating..." : "Register"}
                        </button>

                        {/* ✅ Login link added */}
                        <p className="text-sm text-center text-gray-500 mt-2">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-[#2F6B4F] font-medium hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                </form>

                <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
                    {toasts.map((t) => (
                        <Toast
                            key={t.id}
                            message={t.message}
                            type={t.type}
                            onClose={() =>
                                setToasts((prev) =>
                                    prev.filter((toast) => toast.id !== t.id)
                                )
                            }
                        />
                    ))}
                </div>

            </div>

            <Footer />
        </>
    );
};

export default Register;