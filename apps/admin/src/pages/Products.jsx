import { useState } from "react";
import "../App.css";
import "./products.css";

export default function Products() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  // 🔹 PLACEHOLDER DATA (replace with API later)
  const [products] = useState([
    {
      id: 1,
      name: "Kripsii",
      category: "Snacks",
      active: true,
      variations: [
        {
          id: 1,
          flavour: "BBQ Chicken",
          image: "/images/kripsii-bbq.png",
          weights: [
            { weight: "20g", price: 20 },
            { weight: "30g", price: 30 }
          ]
        },
        {
          id: 2,
          flavour: "Chilli Lemon",
          image: "/images/kripsii-chilli.png",
          weights: [
            { weight: "20g", price: 20 },
            { weight: "30g", price: 30 }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Jripsii - Salted",
      category: "General",
      active: false,
      variations: []
    }
  ]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="products-page">
      {/* HEADER */}


        <div className="filters">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
      </div>

      {/* TABLE */}
      <div className="products-table">
        <div className="table-header">
          <span>ID</span>
          <span>Name</span>
          <span>Category</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filtered.map((product) => (
          <div key={product.id} className="table-row">
            <span>{product.id}</span>
            <span>{product.name}</span>
            <span>{product.category}</span>

            <span className={product.active ? "active" : "inactive"}>
              {product.active ? "Active" : "Inactive"}
            </span>

            <span className="actions">
              <button
                onClick={() =>
                  setExpandedId(
                    expandedId === product.id ? null : product.id
                  )
                }
              >
                View
              </button>

              <button>Edit</button>
            </span>
          </div>
        ))}
      </div>

      {/* EXPANDED VIEW */}
      {expandedId && (
        <div className="product-details">
          {products
            .filter((p) => p.id === expandedId)
            .map((product) => (
              <div key={product.id}>
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>

                <h4>Variations</h4>

                {product.variations.length === 0 && (
                  <p>No variations added.</p>
                )}

                {product.variations.map((v) => (
                  <div key={v.id} className="variation-card">
                    <h5>{v.flavour}</h5>

                    <div className="weights">
                      {v.weights.map((w, i) => (
                        <span key={i}>
                          {w.weight} — KES {w.price}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="detail-actions">
                  <button>Add Variation</button>
                  <button>Add Weight</button>
                  <button className="danger">Deactivate</button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}