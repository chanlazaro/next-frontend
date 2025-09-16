import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { getCookie, deleteCookie } from "cookies-next/client";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor (optional)
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log(data.message || "Unknown error");
          break;
        case 401:
          console.log(data.message || "Unknown error");
          // Redirect to login page or handle token expiration
          break;
        case 404:
          console.log(data.message || "Unknown error");
          break;
        case 500:
          console.log(data.message || "Unknown error");
          break;
        default:
          console.log(data.message || "Unknown error");
      }
    } else {
      console.log("Network error or no response:", error.message);
    }

    // Always reject the error to let the caller handle it if needed
    return Promise.reject(error);
  }
);

// Intercept requests to add the token to the headers if available
api.interceptors.request.use((config) => {
  const token = getCookie("token"); // Get the token from the cookie
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; // Attach token in Authorization header
  }
  return config;
});

export default api;
