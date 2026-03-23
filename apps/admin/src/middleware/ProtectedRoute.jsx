// 📁 apps/admin/src/middleware/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("duka2_token");
  const user = localStorage.getItem("duka2_current_user");

  // ❌ No token or user → redirect
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Validate token
  try {
    const decoded = jwtDecode(token);

    // ⏳ Check expiration
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

  } catch (err) {
    console.error("❌ Invalid or expired token", err);

    // 🧹 Clear bad auth
    localStorage.removeItem("duka2_token");
    localStorage.removeItem("duka2_current_user");

    return <Navigate to="/login" replace />;
  }

  // ✅ Allow access
  return children;
}