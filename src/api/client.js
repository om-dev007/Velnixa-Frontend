import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err.response?.data || err.message);
  }
);