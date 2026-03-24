import { useState } from "react";
import "./analytics.css";

export default function Analytics() {
  const [range, setRange] = useState("7d");

  // 🔹 Placeholder stats (replace with API)
  const stats = {
    revenue: 45200,
    orders: 128,
    customers: 74,
    avgOrder: 353
  };

  const topProducts = [
    { name: "Kripsii BBQ", sold: 120, revenue: 24000 },
    { name: "Kripsii Chilli", sold: 90, revenue: 18000 }
  ];

  return (
    <div className="analytics-page">
      
      {/* ================= HEADER ================= */}
      <div className="analytics-header">
        <h2>Analytics</h2>

        <div className="filters">
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="analytics-stats">
        <Stat label="Revenue" value={`KES ${stats.revenue}`} />
        <Stat label="Orders" value={stats.orders} />
        <Stat label="Customers" value={stats.customers} />
        <Stat label="Avg Order" value={`KES ${stats.avgOrder}`} />
      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="analytics-grid">
        
        {/* Revenue Chart */}
        <div className="panel chart">
          <div className="panel-header">
            <h3>Revenue Trend</h3>
          </div>
          <div className="chart-placeholder">
            Chart goes here
          </div>
        </div>

        {/* Orders Chart */}
        <div className="panel chart">
          <div className="panel-header">
            <h3>Orders Overview</h3>
          </div>
          <div className="chart-placeholder">
            Chart goes here
          </div>
        </div>

      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <div className="panel">
        <div className="panel-header">
          <h3>Top Products</h3>
        </div>

        <div className="table">
          <div className="table-header">
            <span>Product</span>
            <span>Units Sold</span>
            <span>Revenue</span>
          </div>

          {topProducts.map((p, i) => (
            <div key={i} className="table-row">
              <span>{p.name}</span>
              <span>{p.sold}</span>
              <span>KES {p.revenue}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENT ================= */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}