import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  forgotPassword,
  resetPassword,
} from "../api/auth.api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [toasts, setToasts] = useState([]);

  const [resendTimer, setResendTimer] =
    useState(0);

  const showToast = (message, type) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, type },
    ]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3000);
  };

  // STEP 1

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast(
        "Please enter your email",
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      await forgotPassword({
        email,
      });

      showToast(
        "OTP sent successfully",
        "success"
      );

      setStep(2);
    } catch {
      showToast(
        "Failed to send OTP",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2

  const handleResetPassword =
    async (e) => {
      e.preventDefault();

      if (!otp.trim()) {
        showToast(
          "Please enter OTP",
          "error"
        );
        return;
      }

      if (newPassword.length < 6) {
        showToast(
          "Password must be at least 8 characters",
          "error"
        );
        return;
      }

      if (
        newPassword !== confirmPassword
      ) {
        showToast(
          "Passwords do not match",
          "error"
        );
        return;
      }

      setLoading(true);

      try {
        await resetPassword({
          email,
          otp,
          newPassword,
        });

        showToast(
          "Password updated successfully",
          "success"
        );

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } catch {
        showToast(
          "Unable to reset password",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  const handleResendOtp =
    async () => {
      if (resendTimer > 0) {
        return;
      }

      try {
        await forgotPassword({
          email,
        });

        showToast(
          "OTP resent successfully",
          "success"
        );

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
      } catch {
        showToast(
          "Failed to resend OTP",
          "error"
        );
      }
    };

  return (
    <>
      <Helmet>
        <title>
          Forgot Password | Velnixa
        </title>
      </Helmet>

      <Navbar />

      <section className="min-h-[80vh] bg-linear-to-b from-green-50 to-white flex items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          <button
            onClick={() => {
              if (step === 1) {
                navigate("/login");
              } else {
                setStep(1);
              }
            }}
            className="flex items-center gap-2 mb-5 text-gray-600 hover:text-[#2F6B4F] transition cursor-pointer"
          >
            <FiArrowLeft size={18} />
            <span>Back</span>
          </button>

          <form
            onSubmit={
              step === 1
                ? handleSendOtp
                : handleResetPassword
            }
            className="bg-white rounded-3xl shadow-xl border border-black/5 p-8"
          >

            <h1 className="text-3xl font-semibold text-center text-[#1F3D2B] mb-8">

              {step === 1
                ? "Forgot Password"
                : "Reset Password"}

            </h1>

            <div className="space-y-5">

              {step === 1 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5B52] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#2F6B4F]"
                      required
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#4B5B52] mb-2">
                      OTP
                    </label>

                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter OTP"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center tracking-widest outline-none focus:border-[#2F6B4F]"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleResendOtp
                    }
                    disabled={
                      resendTimer > 0
                    }
                    className="text-sm text-[#2F6B4F] hover:text-[#24563F] cursor-pointer disabled:opacity-50"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5B52] mb-2">
                      New Password
                    </label>

                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(
                          e.target.value
                        )
                      }
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#2F6B4F]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#4B5B52] mb-2">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={
                        confirmPassword
                      }
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      placeholder="Confirm password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#2F6B4F]"
                      required
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2F6B4F] hover:bg-[#24563F] text-white py-3 rounded-xl font-medium transition cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : step === 1
                  ? "Send OTP"
                  : "Reset Password"}
              </button>

              {step === 1 && (
                <p className="text-center text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-[#2F6B4F] font-medium"
                  >
                    Login
                  </Link>
                </p>
              )}

            </div>

          </form>

        </div>

        <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
          {toasts.map((t) => (
            <Toast
              key={t.id}
              message={t.message}
              type={t.type}
            />
          ))}
        </div>

      </section>

      <Footer />
    </>
  );
};

export default ForgotPassword;