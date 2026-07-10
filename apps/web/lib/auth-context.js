"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("swiftpay_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/user/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("swiftpay_token");
      })
      .finally(() => setLoading(false));
  }, []);

  function login(token, userData) {
    localStorage.setItem("swiftpay_token", token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("swiftpay_token");
    setUser(null);
    router.push("/signin");
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
