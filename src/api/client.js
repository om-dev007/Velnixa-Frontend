import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {

  const token =
    localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(
        "/auth/rotate-token"
      )
    ) {

      originalRequest._retry = true;

      try {

        const refreshResponse =
          await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/rotate-token`,
            {},
            {
              withCredentials: true,
            }
          );

        const newToken =
          refreshResponse.data.data
            .accessToken;

        localStorage.setItem(
          "accessToken",
          newToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`;

        return API(originalRequest);

      } catch(error) {

        localStorage.removeItem(
          "accessToken"
        );

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);