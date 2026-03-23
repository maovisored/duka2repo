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
      const res = await fetch(`${API_URL}/api/users/login`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
        body: JSON.stringify({
          phone,
          pin: form.pin,
        }),
      });

      // SAFE PARSE (prevents JSON crash on 404)
      const text = await res.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        console.error("Invalid JSON response:", text, err);
      }

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("duka2_user", JSON.stringify(data.user));

      navigate("/app/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
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