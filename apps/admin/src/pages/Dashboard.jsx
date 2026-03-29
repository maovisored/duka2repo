import { useEffect, useState } from "react";
import { getProducts } from "../api/client";
import "../App.css";

export default function Dashboard({ user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // KPI ANIMATION (UNCHANGED)
  useEffect(() => {
    const counters = document.querySelectorAll(".value");

    counters.forEach((counter) => {
      const raw = counter.innerText;
      const target = parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
      let count = 0;

      const update = () => {
        count += Math.ceil(target / 40);

        if (count < target) {
          counter.innerText = raw.includes("%")
            ? count + "%"
            : raw.includes("h")
            ? count + "h"
            : count;
          requestAnimationFrame(update);
        } else {
          counter.innerText = raw;
        }
      };

      update();
    });
  }, []);

  return (
    <div className={`app ${sidebarOpen ? "sidebar-open" : ""}`}>
      <main className="main">
        {/* HEADER (UNCHANGED BUT CLEAN) */}
        <div className="orders-header">
          <h2>Dashboard</h2>

          <div className="header-right">
            <div className="user">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Preview</span>
            </div>

            <button className="menu-toggle" onClick={toggleSidebar}>
  ☰
</button>

            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* KPI STRIP (MATCH ORDERS SPACING) */}
<section className="kpis">
  <div className="kpi">
    <div className="kpi-top">
      <span className="label">Active Orders</span>
      <span className="trend up">+12%</span>
    </div>
    <span className="value">1248</span>
    <span className="sub">vs yesterday</span>
  </div>

  <div className="kpi">
    <div className="kpi-top">
      <span className="label">Revenue Today</span>
      <span className="trend up">+8%</span>
    </div>
    <span className="value">KES 84K</span>
    <span className="sub">daily total</span>
  </div>

  <div className="kpi">
    <div className="kpi-top">
      <span className="label">Customers</span>
      <span className="trend down">-3%</span>
    </div>
    <span className="value">342</span>
    <span className="sub">active users</span>
  </div>

  <div className="kpi">
    <div className="kpi-top">
      <span className="label">Conversion</span>
      <span className="trend up">+2%</span>
    </div>
    <span className="value">94%</span>
    <span className="sub">checkout rate</span>
  </div>
</section>

        {/* MAIN CONTENT */}
        <div className="grid">
          {/* RECENT ORDERS TABLE */}
          <div className="table-container">
            <div className="table-header">
              <span>ID</span>
              <span>Product</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="table-row">
                <span>#{p.id}</span>
                <span>{p.name}</span>

                <span className="status processing">
                  {p.status || "ACTIVE"}
                </span>

                <span className="actions">
                  <button className="btn-sm">View</button>
                </span>
              </div>
            ))}
          </div>

          {/* SYSTEM SUMMARY (converted to structured panel) */}
          <div className="table-container">
            <div className="table-header">
              <span>Metric</span>
              <span>Value</span>
            </div>

            <div className="table-row">
              <span>Regions Active</span>
              <span>12 / 14</span>
            </div>

            <div className="table-row">
              <span>Latency</span>
              <span>Low</span>
            </div>

            <div className="table-row">
              <span>Sync Status</span>
              <span className="status confirmed">Stable</span>
            </div>
          </div>

          {/* ALERTS */}
          <div className="table-container">
            <div className="table-header">
              <span>System Alerts</span>
              <span>Status</span>
            </div>

            <div className="table-row">
              <span>Inventory sync completed</span>
              <span className="status delivered">OK</span>
            </div>

            <div className="table-row">
              <span>Route delay · Kisumu</span>
              <span className="status pending">Warning</span>
            </div>

            <div className="table-row">
              <span>Reconciliation running</span>
              <span className="status confirmed">Active</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}