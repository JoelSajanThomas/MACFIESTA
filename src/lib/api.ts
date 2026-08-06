import axios from "axios";
import { API_BASE_URL } from "./constants";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to inject JWT token in Authorization headers
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("macfiesta_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle authentication expiration redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("macfiesta_token");
        sessionStorage.removeItem("macfiesta_user");
        // Optional: redirect to sign-in page if not on a public path
        if (
          window.location.pathname !== "/signin" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/admin/login" &&
          window.location.pathname !== "/"
        ) {
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login";
          } else {
            window.location.href = "/signin";
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

