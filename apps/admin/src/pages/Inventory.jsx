import { useState } from "react";
import "../App.css";
import "./inventory.css";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 Replace with API later
  const [inventory] = useState([
    {
      id: "INV-001",
      product: "Kripsii BBQ",
      sku: "BBQ-200",
      stock: 120,
      status: "IN_STOCK",
      last_updated: "2026-03-23",
      movements: [
        { type: "IN", qty: 50, date: "2026-03-23" },
        { type: "OUT", qty: 10, date: "2026-03-22" }
      ]
    },
    {
      id: "INV-002",
      product: "Kripsii Chilli",
      sku: "CH-200",
      stock: 5,
      status: "LOW",
      last_updated: "2026-03-23",
      movements: [
        { type: "OUT", qty: 20, date: "2026-03-23" }
      ]
    }
  ]);

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "ALL" || item.status === filter;

    return matchSearch && matchFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "IN_STOCK":
        return "status in";
      case "LOW":
        return "status low";
      case "OUT":
        return "status out";
      default:
        return "status";
    }
  };

  return (
    <div className="inventory-page">
      {/* HEADER */}
      <div className="inventory-header">
        <h2>Inventory</h2>

        <div className="filters">
          <input
            type="text"
            placeholder="Search product, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="IN_STOCK">In Stock</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="inventory-table">
        <div className="table-header">
          <span>Product</span>
          <span>SKU</span>
          <span>Stock</span>
          <span>Status</span>
          <span>Updated</span>
          <span>Actions</span>
        </div>

        {filtered.map((item) => (
          <div key={item.id} className="table-row">
            <span>{item.product}</span>
            <span>{item.sku}</span>
            <span>{item.stock}</span>

            <span className={getStatusClass(item.status)}>
              {item.status.replace("_", " ")}
            </span>

            <span>{item.last_updated}</span>

            <span className="actions">
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === item.id ? null : item.id
                  )
                }
              >
                View
              </button>
              <button>Adjust</button>
            </span>
          </div>
        ))}
      </div>

      {/* EXPANDED MOVEMENTS */}
      {expandedId && (
        <div className="inventory-details">
          {inventory
            .filter((i) => i.id === expandedId)
            .map((item) => (
              <div key={item.id}>
                <h3>Stock Movements</h3>

                {item.movements.length === 0 ? (
                  <p>No movements</p>
                ) : (
                  item.movements.map((m, i) => (
                    <div key={i} className="movement">
                      <span className={`type ${m.type.toLowerCase()}`}>
                        {m.type}
                      </span>
                      <span>{m.qty}</span>
                      <span>{m.date}</span>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}