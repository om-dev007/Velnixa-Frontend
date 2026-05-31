import { API } from "./client";

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const verifyOtp = (data) =>
  API.post("/auth/verify-otp", data);

export const resendOtp = (data) =>
  API.post("/auth/resend-otp", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const logoutUser = () =>
  API.post("/auth/logout");

export const generateNewToken = () =>
  API.post("/auth/access-token");