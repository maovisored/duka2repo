/* eslint-env node */

import { useEffect, useState } from "react";

import api from "../api/client";
import "../customers.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [orders, setOrders] = useState([]);

  // ✅ DECLARE FIRST
  const fetchCustomers = async () => {
    const res = await api.get("/users");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomer = async (id) => {
    setSelected(id);
    const res = await api.get(`/users/${id}/orders`);
    setOrders(res.data);
  };

  const filtered = customers.filter((c) =>
    (c.phone || "").includes(search)
  );

  return (
    <div className="customers-page">
      <input
        placeholder="Search phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table">
        {filtered.map((c) => (
          <div key={c.id} className="row">
            <span>{c.phone}</span>
            <span>{c.first_name}</span>
            <span>KES {c.total_spent}</span>
            <span>{c.total_orders}</span>

            <button onClick={() => openCustomer(c.id)}>
              View
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="panel">
          <h3>Orders</h3>

          {orders.map((o) => (
            <div key={o.id}>
              <span>{o.id}</span>
              <span>{o.amount}</span>
              <span>{o.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}