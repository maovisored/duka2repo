import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showPin, setShowPin] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    pin: "",
  });

  // SPLASH
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (!p.startsWith("254")) p = "254" + p;
    return p;
  };

  // LOGIN
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  const phone = normalizePhone(form.phone);
  const API_URL = import.meta.env.VITE_API_URL;

  try {
    console.log("➡️ Sending login request to:", API_URL);

    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, pin: form.pin }),
    });

    console.log("⬅️ Response status:", res.status);

    const text = await res.text();
    console.log("⬅️ Raw response:", text);

    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      console.error("❌ JSON parse failed:", err);
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      console.error("❌ Login failed:", data);
      throw new Error(data.message || `Login failed (${res.status})`);
    }

    console.log("✅ Login success:", data);

    localStorage.setItem("duka2_current_user", JSON.stringify(data.user));

    navigate("/");

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);

    alert(err.message || "Login failed — check console");

  } finally {
    setLoading(false);
  }
};

  // SPLASH UI
  if (loading) {
    return (
      <div className="splash-screen">
        <div className="floating-logo">
          <span>Duka</span>
          <span className="logo-orange">2</span>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <h1 className="app-title">Duka2</h1>

        <form onSubmit={handleLogin}>

          <div className="form-row">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>PIN</label>
            <div className="pin-field">
              <input
                type={showPin ? "text" : "password"}
                name="pin"
                value={form.pin}
                onChange={handleChange}
                required
              />
              <span
                className="pin-toggle"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? "🙈" : "👁"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <footer className="app-footer">
          <p>Made by AnteDot Africa</p>
          <span>© 2026</span>
        </footer>

      </div>
    </div>
  );
}