import { useState } from "react";
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

import "./theme.css";

// 🔥 Initialize auth ONCE (no useEffect needed)
const getInitialUser = () => {
  const token = localStorage.getItem("duka2_token");
  const savedUser = localStorage.getItem("duka2_current_user");

  if (token && savedUser) {
    try {
      return JSON.parse(savedUser);
    } catch (err) {
      console.error("Invalid stored user:", err);
      return null;
    }
  }

  return null;
};

export default function App() {
  const [user, setUser] = useState(getInitialUser);

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

  return (
    <Routes>

      {/* LOGIN — BLOCK IF ALREADY LOGGED IN */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* PROTECTED ROUTES */}
      <Route
        element={
          user ? (
            <AppLayout user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}