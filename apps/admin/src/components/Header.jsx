import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "../App.css";


export default function Header({ user, onLogout }) {
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const getTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/orders":
        return "Orders";
      case "/customers":
        return "Customers";
      case "/products":
        return "Products";
      case "/analytics":
        return "Analytics";
      default:
        return "Admin Panel";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <h2>{getTitle()}</h2>
      </div>

      <div className="header-right">
        {/* RIGHT SIDE ROW */}
        <div className="right-row">
          <button
            className="btn icon"
            onClick={() => setShowNotif(!showNotif)}
          >
            🔔
          </button>

          {showNotif && (
            <div className="dropdown">
              <p>No new notifications</p>
            </div>
          )}

          <button className="btn danger" onClick={onLogout}>
            Sign Out
          </button>
        </div>

        {/* User */}
        <div className="user-info">
          <span className="user-name">{user?.name || "Admin"}</span>
        </div>

      </div>
    </header>
  );
}