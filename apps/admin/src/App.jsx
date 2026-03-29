import { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layout/AppLayout";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard";

import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";

import ProtectedRoute from "./middleware/ProtectedRoute";

import "./theme.css";

export default function App() {
  // Start user as null to force login
  const [user, setUser] = useState(null);

  /* ===================== */
  /* AUTH HANDLERS */
  /* ===================== */
  const handleLogin = (userData, token) => {
    localStorage.setItem("duka2_current_user", JSON.stringify(userData));
    localStorage.setItem("duka2_token", token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("duka2_current_user");
    localStorage.removeItem("duka2_token");
    setUser(null);
  };

  /* ===================== */
  /* FORCE LOGOUT ON LOAD */
  /* ===================== */
    localStorage.removeItem("duka2_current_user");
    localStorage.removeItem("duka2_token");


  /* ===================== */
  /* IDLE TIMER SETUP */
  /* ===================== */
  const timeoutRef = useRef(null);
  const IDLE_TIME = 10 * 60 * 1000; // 10 minutes

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleLogout();
      alert("Session expired. Please log in again.");
    }, IDLE_TIME);
  };

  /* ===================== */
  /* TRACK USER ACTIVITY */
  /* ===================== */
  useEffect(() => {
    if (!user) return;

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timeoutRef.current);
    };
  }, [user]);

  /* ===================== */
  /* ROUTES */
  /* ===================== */
  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        }
      />

      {/* PROTECTED */}
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard user={user} />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="customers" element={<Customers />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}