import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("login");
  const [showPin, setShowPin] = useState(false);

  const [form, setForm] = useState({
    phone: "",
    pin: "",
    firstName: "",
    lastName: "",
    idNo: "",
    shopName: "",
    shopAddress: "",
    confirmPin: "",
  });

  // =========================
  // SPLASH SCREEN (RESTORED)
  // =========================
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
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

  // =========================
  // LOGIN (UNCHANGED)
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const phone = normalizePhone(form.phone);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin: form.pin }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("duka2_user", JSON.stringify(data.user));
      navigate("/app/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER (UNCHANGED)
  // =========================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (form.pin !== form.confirmPin) {
      alert("PINs do not match");
      return;
    }

    setLoading(true);

    const phone = normalizePhone(form.phone);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          pin: form.pin,
          firstName: form.firstName,
          lastName: form.lastName,
          idNo: form.idNo,
          shopName: form.shopName,
          shopAddress: form.shopAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Registered successfully. Login now.");
      setMode("login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SPLASH UI
  // =========================
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

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");
                  if (!value.startsWith("254")) {
                    value =
                      "254" +
                      value.replace(/^0+/, "").replace(/^254?/, "");
                  }
                  setForm({ ...form, phone: value });
                }}
                required
              />
            </div>

            <div className="pin-field">
              <input
                type={showPin ? "text" : "password"}
                name="pin"
                maxLength="4"
                placeholder="4-digit PIN"
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

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-links">
              <span onClick={() => setMode("register")}>
                Create account
              </span>
            </div>
            
          </form>
        )}
        

        {/* ================= REGISTER ================= */}
        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <label>First Name</label>
              <input
                name="firstName"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Last Name</label>
              <input name="lastName" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>ID Number</label>
              <input name="idNo" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Shop Name</label>
              <input name="shopName" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>Shop Address</label>
              <input name="shopAddress" onChange={handleChange} />
            </div>

            <div className="form-row">
              <label>PIN</label>
              <div className="pin-field">
                <input
                  type={showPin ? "text" : "password"}
                  name="pin"
                  maxLength="4"
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

            <div className="form-row">
              <label>Confirm PIN</label>
              <input
                type="password"
                name="confirmPin"
                maxLength="4"
                value={form.confirmPin}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>

            <div className="auth-links">
              <span onClick={() => setMode("login")}>
                Back to Sign In
              </span>
            </div>
          </form>
        )}

                <footer className="app-footer">
          <p>Made by AnteDot Africa</p>
          <span>© 2026</span>
        </footer>

      </div>
    </div>
  );
}