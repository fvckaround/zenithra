"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { apiFetch } from "@/lib/apiClient";

const UserContext = createContext(null);

export function UserProvider({ initialUser, children }) {
  const [user, setUser] = useState(initialUser);

  // Re-fetch the current user (e.g. after a deposit/withdrawal/investment).
  const refreshUser = useCallback(async () => {
    try {
      const res = await apiFetch("/api/me");
      setUser(res.user);
      return res.user;
    } catch {
      return null;
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
