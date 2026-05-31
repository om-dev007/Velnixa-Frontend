import React, { useState } from "react";
import { verifyOtp, resendOtp } from "../api/auth.api";

const OtpVerification = ({ email, showToast, onSuccess }) => {

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const verifyHandler = async () => {
        try {

            if (!otp.trim()) {
                return showToast("Please enter OTP", "error");
            }

            setLoading(true);

            const res = await verifyOtp({
                email,
                otp,
            });

            showToast(
                res.data.message || "OTP verified successfully",
                "success"
            );

            onSuccess();

        } catch (error) {

            showToast(
                error.message || "OTP verification failed",
                "error"
            );

        } finally {
            setLoading(false);
        }
    };

    const resendHandler = async () => {
        try {

            setResending(true);

            const res = await resendOtp({ email });

            showToast(
                res.data.message || "OTP sent successfully",
                "success"
            );

        } catch (error) {

            showToast(
                error.message || "Failed to resend OTP",
                "error"
            );

        } finally {
            setResending(false);
        }
    };

    return (
        <div className="space-y-6">

            <div className="text-center">

                <h2 className="text-xl font-semibold text-[#1F3D2B]">
                    Verify Email
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                    OTP has been sent to
                </p>

                <p className="font-medium text-[#2F6B4F]">
                    {email}
                </p>

            </div>

            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#2F6B4F]"
            />

            <button
                type="button"
                disabled={loading}
                onClick={verifyHandler}
                className="cursor-pointer w-full bg-[#2F6B4F] text-white py-3 rounded-lg font-medium"
            >
                {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
                type="button"
                disabled={resending}
                onClick={resendHandler}
                className="cursor-pointer w-full border border-[#2F6B4F] text-[#2F6B4F] py-3 rounded-lg font-medium"
            >
                {resending ? "Sending..." : "Resend OTP"}
            </button>

        </div>
    );
};

export default OtpVerification;