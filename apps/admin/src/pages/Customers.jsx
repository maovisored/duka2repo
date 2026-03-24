import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import "../App.css";
import "./Customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [details, setDetails] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/users", { params: { page, limit } });
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      setError("Failed to load customers", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/users/stats");
      setStats(res.data);
    } catch {
      setStats(null);
    }
  }, []);

  const openCustomer = async (id) => {
    setSelected(id);
    try {
      const res = await api.get(`/users/${id}/details`);
      setDetails(res.data);
    } catch {
      setDetails(null);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, [fetchCustomers, fetchStats]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCustomers();
      fetchStats();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchCustomers, fetchStats]);

  const filtered = customers
    .filter((c) =>
      (c.phone || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => {
      if (filter === "high") return c.total_spent > 10000;
      if (filter === "active") return c.total_orders > 5;
      return true;
    });

  return (
    <div className="page">
      <div className="page-header">
      </div>

      {/* STATS */}
      <div className="stats">
        <Stat label="Customers" value={stats?.total} />
        <Stat label="Active" value={stats?.active} />
        <Stat label="Top Spender" value={`KES ${stats?.top_spender ?? 0}`} />
      </div>

      {/* CONTROLS */}
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

      {/* TABLE */}
      <div className="card">
        <div className="table-header">
          <span>Phone</span>
          <span>Name</span>
          <span>Spent</span>
          <span>Orders</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading ? (
          <div className="table-row">Loading...</div>
        ) : error ? (
          <div className="table-row">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="table-row">No customers found</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="table-row">
              <span>{c.phone}</span>
              <span>{c.first_name}</span>
              <span>KES {c.total_spent}</span>
              <span>{c.total_orders}</span>
              <span className={`badge ${getStatus(c)}`}>
                {getStatus(c)}
              </span>
              <button className="btn" onClick={() => openCustomer(c.id)}>
                View
              </button>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="controls" style={{ marginTop: 10 }}>
        <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </button>
        <span>Page {page}</span>
        <button className="btn" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>

      {/* DRAWER */}
      {selected && details && (
        <div className="drawer">
          <div className="page-header">
            <h3>{details.first_name}</h3>
            <button className="btn" onClick={() => setSelected(null)}>
              X
            </button>
          </div>

          <p>Phone: {details.phone}</p>
          <p>Total: KES {details.total_spent}</p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <span>{label}</span>
      <strong>{value ?? "--"}</strong>
    </div>
  );
}

function getStatus(c) {
  if (c.total_orders > 5) return "active";
  if (c.total_orders > 0) return "pending";
  return "inactive";
}