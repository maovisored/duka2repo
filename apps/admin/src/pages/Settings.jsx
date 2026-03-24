import { useState } from "react";
import "../App.css";
import "./settings.css";

export default function Settings() {
  const [active, setActive] = useState("profile");

  const menu = [
    { id: "profile", label: "Profile" },
    { id: "business", label: "Business" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div className="settings-page">
      {/* MINI SIDEBAR */}
      <div className="settings-sidebar">
        {menu.map((item) => (
          <button
            key={item.id}
            className={`settings-tab ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CONTENT PANEL */}
      <div className="settings-content">
        {active === "profile" && <Profile />}
        {active === "business" && <Business />}
        {active === "notifications" && <Notifications />}
        {active === "security" && <Security />}
        {active === "integrations" && <Integrations />}
      </div>
    </div>
  );
}

/* ================= SECTIONS ================= */

function Profile() {
  return (
    <div className="settings-section">
      <h3>Profile Settings</h3>

      <div className="form-grid">
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <input placeholder="Phone" />
      </div>

      <div className="form-actions">
        <button className="btn primary">Save Changes</button>
      </div>
    </div>
  );
}

function Business() {
  return (
    <div className="settings-section">
      <h3>Business Settings</h3>

      <div className="form-grid">
        <input placeholder="Business Name" />
        <input placeholder="Location" />
        <input placeholder="Currency (KES)" />
      </div>

      <div className="form-actions">
        <button className="btn primary">Save</button>
      </div>
    </div>
  );
}

function Notifications() {
  return (
    <div className="settings-section">
      <h3>Notification Preferences</h3>

      <div className="toggle-group">
        <label>
          <input type="checkbox" /> Order Alerts
        </label>
        <label>
          <input type="checkbox" /> Payment Alerts
        </label>
        <label>
          <input type="checkbox" /> Promotions
        </label>
      </div>

      <div className="form-actions">
        <button className="btn primary">Update</button>
      </div>
    </div>
  );
}

function Security() {
  return (
    <div className="settings-section">
      <h3>Security</h3>

      <div className="form-grid">
        <input type="password" placeholder="Current Password" />
        <input type="password" placeholder="New Password" />
      </div>

      <div className="form-actions">
        <button className="btn danger">Change Password</button>
      </div>
    </div>
  );
}

function Integrations() {
  return (
    <div className="settings-section">
      <h3>Integrations</h3>

      <div className="integration-card">
        <span>M-Pesa Daraja</span>
        <button className="btn">Configure</button>
      </div>

      <div className="integration-card">
        <span>SMS Provider</span>
        <button className="btn">Connect</button>
      </div>
    </div>
  );
}