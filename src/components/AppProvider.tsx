"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAppState } from "../hooks/useAppState";
import { AuthProvider } from "../hooks/useAuth";

// Create context for app state
const AppStateContext = createContext<ReturnType<typeof useAppState> | null>(
  null
);

// Theme context
interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// Hook to use app state
export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    // Provide a minimal no-op fallback for prerendering/static export
    return {
      activeTab: "dashboard",
      setActiveTab: () => {},
      users: [],
      setUsers: () => {},
      events: [],
      setEvents: () => {},
      albums: [],
      setAlbums: () => {},
      pictures: [],
      setPictures: () => {},
      departmentInfo: { name: "", code: "", slug: "", workspace: "" },
      setDepartmentInfo: () => {},
      isAuthenticated: false,
      setIsAuthenticated: () => {},
      currentStudentId: "",
      setCurrentStudentId: () => {},
    } as unknown as ReturnType<typeof useAppState>;
  }
  return context;
};

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within an AppProvider");
  }
  return context;
};

// Provider component
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const appState = useAppState();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <AuthProvider>
      <AppStateContext.Provider value={appState}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          {children}
        </ThemeContext.Provider>
      </AppStateContext.Provider>
    </AuthProvider>
  );
};

export default AppProvider;
