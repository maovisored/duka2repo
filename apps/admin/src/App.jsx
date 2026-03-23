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
import Reports from "./pages/Reports";
import Network from "./pages/Network";
import Alerts from "./pages/Alerts";
import LiveFeed from "./pages/LiveFeed";
import Dispatch from "./pages/Dispatch";
import Inventory from "./pages/Inventory";
import ProtectedRoute from "./middleware/ProtectedRoute";

import "./theme.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("duka2_current_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    localStorage.setItem("duka2_current_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("duka2_current_user");
    setUser(null);
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<Login onLogin={handleLogin} />} />

      {/* PROTECTED APP WITH LAYOUT */}
      <Route
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard user={user} />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/network" element={<Network />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/live-feed" element={<LiveFeed />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}