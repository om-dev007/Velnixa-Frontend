import { API } from "./client";

export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const logoutUser = () =>
  API.post("/auth/logout");