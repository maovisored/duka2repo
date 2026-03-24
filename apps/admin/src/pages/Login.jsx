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

  /* ===================== */
  /* REDIRECT IF LOGGED IN */
  /* ===================== */
  useEffect(() => {
    try {
      const token = localStorage.getItem("duka2_token");
      const user = JSON.parse(localStorage.getItem("duka2_current_user"));

      if (token && user) {
        navigate("/", { replace: true });
      }
    } catch {
      // invalid JSON → ignore
    }
  }, [navigate]);

  /* ===================== */
  /* SPLASH */
  /* ===================== */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // slightly faster
    return () => clearTimeout(timer);
  }, []);

  /* ===================== */
  /* INPUT HANDLER */
  /* ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== */
  /* PHONE NORMALIZER */
  /* ===================== */
  const normalizePhone = (phone) => {
    let p = phone.replace(/\D/g, "");
    if (p.startsWith("0")) p = "254" + p.slice(1);
    if (!p.startsWith("254")) p = "254" + p;
    return p;
  };

  /* ===================== */
  /* LOGIN */
  /* ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔒 prevent double submit

    setLoading(true);

    const phone = normalizePhone(form.phone);
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, pin: form.pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 💾 Save auth
      localStorage.setItem("duka2_current_user", JSON.stringify(data.user));
      localStorage.setItem("duka2_token", data.token);

      // 🚀 Redirect once (no loop)
      navigate("/", { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== */
  /* SPLASH UI */
  /* ===================== */
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

  /* ===================== */
  /* MAIN UI */
  /* ===================== */
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