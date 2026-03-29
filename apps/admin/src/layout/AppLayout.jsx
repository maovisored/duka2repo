import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "../App.css";

export default function AppLayout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Header dropdown
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Prevent scroll when sidebar is open (mobile UX)
  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sidebarOpen);
  }, [sidebarOpen]);

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("duka2_current_user");
      if (onLogout) onLogout();
      navigate("/");
    }
  };

  // Sidebar links for dropdown (responsive menu)
  const sidebarLinks = [
    { to: "/", label: "Overview" },
    { to: "/orders", label: "Orders" },
    { to: "/products", label: "Products" },
    { to: "/customers", label: "Customers" },
    { to: "/transactions", label: "Transactions" },
    { to: "/inventory", label: "Inventory" },
    { to: "/analytics", label: "Analytics" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <Sidebar
        user={user}
        onLogout={handleSignOut}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* OVERLAY (mobile only) */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}

      {/* MAIN CONTENT */}
      <div className="app-content">
        {/* HEADER */}
        <header className="app-header">
          <div className="header-left">

            <div className="logo">
              <span className="logo-white">Duka</span>
              <span className="logo-orange">2</span>
            </div>
          </div>

          <div className="header-right" ref={wrapperRef}>
            <button
              className="profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
            >
              ☰
            </button>

            {menuOpen && (
              <div className="profile-dropdown open">
                {sidebarLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="dropdown-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}

                <div className="divider" />
                <button className="logout" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* MAIN PAGE */}
        <main className="main">
          <Outlet />
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}