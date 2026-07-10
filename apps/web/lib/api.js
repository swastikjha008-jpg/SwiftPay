import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

// attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("swiftpay_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function extractErrorMessage(err) {
  return err?.response?.data?.message || "Something went wrong. Please try again.";
}
