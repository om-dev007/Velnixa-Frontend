import { API } from "./client";

// Register
export const registerUser = (data) =>
  API.post("/auth/register", data);

// Verify OTP
export const verifyOtp = (data) =>
  API.post("/auth/verify-otp", data);

// Resend OTP
export const resendOtp = (data) =>
  API.post("/auth/resend-otp", data);

// Login
export const loginUser = (data) =>
  API.post("/auth/login", data);

// Logout
export const logoutUser = () =>
  API.post("/auth/logout");

// Logout from all devices
export const logoutFromAllDevices = () =>
  API.post("/auth/logout-all");

// Generate new access token
export const generateNewToken = () =>
  API.post("/auth/rotate-token");

export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

export const resetPassword = (data) =>
  API.post("/auth/reset-password", data);