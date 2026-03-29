import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./header.css";

export default function Header({ sidebarLinks = [] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const handleSignOut = () => {
    setMenuOpen(false);
    if (window.confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("duka2_current_user");
      navigate("/");
    }
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="app-header">
      {/* LEFT: Logo */}
      <div className="header-left">

        <div className="logo">
          <span className="logo-white">Duka</span>
          <span className="logo-orange">2</span>
        </div>
      </div>

      {/* RIGHT: Profile + Dropdown */}
      <div className="header-right" ref={wrapperRef}>
        <button className="profile-btn" onClick={() => setMenuOpen((o) => !o)}>
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
  );
}