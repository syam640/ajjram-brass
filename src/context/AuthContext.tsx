"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { currentUser as userData } from "@/data/users";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: "customer" | "seller";
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isSeller: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ajjram-auth");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const isSeller = email.includes("seller") || email.includes("admin");
    const u: User = isSeller
      ? {
          id: "USR-ADMIN",
          name: "Ajjram Admin",
          email,
          phone: "+91 98765 43210",
          avatar: "https://ui-avatars.com/api/?name=Ajjram+Admin&background=0B2D1F&color=C9A86A&size=200",
          role: "seller",
        }
      : { ...userData, email, role: "customer" as const };
    setUser(u);
    setIsLoggedIn(true);
    localStorage.setItem("ajjram-auth", JSON.stringify(u));
    return true;
  };

  const signup = async (name: string, email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const u: User = { id: "USR-" + Date.now(), name, email, phone: "", avatar: "", role: "customer" };
    setUser(u);
    setIsLoggedIn(true);
    localStorage.setItem("ajjram-auth", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("ajjram-auth");
  };

  const googleLogin = async () => {
    await new Promise((r) => setTimeout(r, 800));
    const u: User = { ...userData, name: "Google User", email: "googleuser@gmail.com", role: "customer" };
    setUser(u);
    setIsLoggedIn(true);
    localStorage.setItem("ajjram-auth", JSON.stringify(u));
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isSeller: user?.role === "seller", login, signup, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
