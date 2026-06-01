import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [resendTimer, setResendTimer] = useState(0);

    const showToast = (message, type) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    // Send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) {
            showToast("Please enter your email address", "error");
            return;
        }

        setLoading(true);
        try {
            // API Call - Replace with your actual API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("OTP sent to your email successfully!", "success");
                setStep(2);
                // Start resend timer
                setResendTimer(60);
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                showToast(data.message || "Failed to send OTP", "error");
            }
        } catch {
            showToast("Something went wrong. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length !== 6) {
            showToast("Please enter valid 6-digit OTP", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("OTP verified successfully!", "success");
                setStep(3);
            } else {
                showToast(data.message || "Invalid OTP", "error");
            }
        } catch {
            showToast("Failed to verify OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    // Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (newPassword.length < 6) {
            showToast("Password must be at least 6 characters", "error");
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("Password reset successfully! Please login.", "success");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                showToast(data.message || "Failed to reset password", "error");
            }
        } catch {
            showToast("Something went wrong", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) {
            showToast(`Please wait ${resendTimer} seconds`, "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                showToast("OTP resent successfully!", "success");
                setResendTimer(60);
                const timer = setInterval(() => {
                    setResendTimer((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                showToast(data.message || "Failed to resend OTP", "error");
            }
        } catch {
            showToast("Failed to resend OTP", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password | Velnixa</title>
            </Helmet>

            <Navbar />

            <div className="min-h-[80vh] bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <button
                        onClick={() => step === 1 ? navigate("/login") : setStep(step - 1)}
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-[#2F6B4F] transition-colors"
                    >
                        <FiArrowLeft size={18} />
                        <span className="text-sm">Back</span>
                    </button>

                    <form
                        onSubmit={
                            step === 1 ? handleSendOtp :
                            step === 2 ? handleVerifyOtp :
                            handleResetPassword
                        }
                        className="bg-white rounded-2xl shadow-xl border border-black/5 px-6 py-8 sm:px-10 sm:py-10"
                    >
                        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-[#1F3D2B] mb-6 sm:mb-8">
                            {step === 1 && "Forgot Password"}
                            {step === 2 && "Verify OTP"}
                            {step === 3 && "Reset Password"}
                        </h1>

                        <div className="space-y-5 sm:space-y-6">
                            {/* Step 1: Email Input */}
                            {step === 1 && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[#4B5B52]">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        We'll send a 6-digit OTP to this email
                                    </p>
                                </div>
                            )}

                            {/* Step 2: OTP Input */}
                            {step === 2 && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-[#4B5B52]">
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            placeholder="Enter 6-digit OTP"
                                            maxLength="6"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F] text-center text-lg tracking-widest"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            OTP sent to {email}
                                        </p>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={resendTimer > 0}
                                        className="text-sm text-[#2F6B4F] hover:text-[#24563F] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                                    </button>
                                </>
                            )}

                            {/* Step 3: New Password */}
                            {step === 3 && (
                                <>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-[#4B5B52]">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium text-[#4B5B52]">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-[#2F6B4F] cursor-pointer text-white py-3 rounded-lg font-medium hover:bg-[#24563F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : 
                                    step === 1 ? "Send OTP" :
                                    step === 2 ? "Verify OTP" :
                                    "Reset Password"
                                }
                            </button>

                            {step === 1 && (
                                <p className="text-sm text-center text-gray-500">
                                    Remember your password?{" "}
                                    <Link to="/login" className="text-[#2F6B4F] font-medium">
                                        Login
                                    </Link>
                                </p>
                            )}
                        </div>
                    </form>
                </div>

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

export default ForgotPassword;