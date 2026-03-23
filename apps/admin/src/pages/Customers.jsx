import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [details, setDetails] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users?page=${page}&limit=20`);
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
      setCustomers(generateMockCustomers());
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch {
      setStats(generateMockStats());
    }
  }, []);

  const openCustomer = async (id) => {
    setSelected(id);

    try {
      const res = await api.get(`/users/${id}/details`);
      setDetails(res.data);
    } catch {
      setDetails(generateMockDetails(id));
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  // ================= FILTER =================
  const filtered = customers
    .filter((c) =>
      (c.phone || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      if (filter === "high") return c.total_spent > 10000;
      if (filter === "active") return c.total_orders > 5;
      return true;
    });

  // ================= UI =================
  return (
    <div className="customers-page">
      {/* ===== STATS ===== */}
      <div className="stats">
        <Stat label="Customers" value={stats?.total} />
        <Stat label="Active" value={stats?.active} />
        <Stat label="New" value={stats?.new} />
        <Stat label="Top Spender" value={`KES ${stats?.top_spender}`} />
      </div>

      {/* ===== CONTROLS ===== */}
      <div className="controls">
        <input
          placeholder="Search phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="high">High Spenders</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="table">
        <div className="row header">
          <span>Phone</span>
          <span>Name</span>
          <span>Spent</span>
          <span>Orders</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          <div className="empty">Loading...</div>
        ) : error ? (
          <div className="empty">Failed to load</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="row">
              <span>{c.phone}</span>
              <span>{c.first_name}</span>
              <span>KES {c.total_spent}</span>
              <span>{c.total_orders}</span>
              <span className={`status ${getStatus(c)}`}>
                {getStatus(c)}
              </span>

              <button onClick={() => openCustomer(c.id)}>View</button>
            </div>
          ))
        )}
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* ===== DRAWER ===== */}
      {selected && details && (
        <div className="drawer">
          <div className="drawer-header">
            <h3>{details.first_name}</h3>
            <button onClick={() => setSelected(null)}>X</button>
          </div>

          <div className="drawer-body">
            <p>Phone: {details.phone}</p>
            <p>Total Spent: KES {details.total_spent}</p>
            <p>Avg Order: KES {details.avg_order}</p>
            <p>Last Order: {details.last_order}</p>
            <p>Top Product: {details.top_product}</p>

            <h4>Orders</h4>
            {details.orders.map((o) => (
              <div key={o.id} className="order">
                <span>{o.id}</span>
                <span>KES {o.amount}</span>
                <span>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ================= COMPONENTS =================
function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value ?? "--"}</strong>
    </div>
  );
}

// ================= HELPERS =================
function getStatus(c) {
  if (c.total_orders > 5) return "active";
  if (c.total_orders > 0) return "normal";
  return "inactive";
}

// ================= MOCK DATA =================
function generateMockCustomers() {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    phone: "07" + Math.floor(Math.random() * 1e8),
    first_name: "User " + (i + 1),
    total_spent: Math.floor(Math.random() * 20000),
    total_orders: Math.floor(Math.random() * 10),
  }));
}

function generateMockStats() {
  return {
    total: 1245,
    active: 320,
    new: 58,
    top_spender: 45200,
  };
}

function generateMockDetails(id) {
  return {
    id,
    first_name: "User " + id,
    phone: "07" + Math.floor(Math.random() * 1e8),
    total_spent: 12000,
    avg_order: 2400,
    last_order: "2026-03-20",
    top_product: "Krackles",

    orders: Array.from({ length: 5 }).map((_, i) => ({
      id: "ORD-" + (i + 1),
      amount: Math.floor(Math.random() * 5000),
      status: ["paid", "pending", "failed"][
        Math.floor(Math.random() * 3)
      ],
    })),
  };
}