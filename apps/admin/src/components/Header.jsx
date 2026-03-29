import { useState, useEffect, useRef } from "react";
import profileIcon from "../assets/profile.png"; // fallback avatar
import { useNavigate, useLocation } from "react-router-dom";
import "./header.css";

export default function Header({ user, toggleSidebar }) {
  const [openMenu, setOpenMenu] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSignOut = () => {
    setOpenMenu(false);
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("duka2_current_user");
      navigate("/");
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      {/* Left: Logo + Page Title */}
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>

        <h1 className="logo">
          <span className="logo-black">Duka</span>
          <span className="logo-orange">2</span>
        </h1>

        <h2 className="page-title">{getTitle()}</h2>
      </div>

      {/* Right: Profile Hamburger */}
      <div className="header-right">
        <div className="profile-wrapper" ref={wrapperRef}>
          <img
            src={profileIcon}
            alt="Profile"
            className="profile-icon"
            onClick={() => setOpenMenu((o) => !o)}
          />

          {openMenu && (
            <div className="profile-dropdown open">
              <div className="menu-item user-name">{user?.name || "Admin"}</div>
              <button onClick={() => navigate("/profile")}>My Profile</button>
              <button onClick={() => navigate("/orders")}>Orders</button>
              <button className="logout" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}