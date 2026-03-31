// src/pages/Products.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./products.css";

// 🔑 CHANGE THIS ONLY (after Railway deploy)
const API_BASE = "https://iwioeecgwuvibgrjbrvg.supabase.co/api/full";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Tea Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/full`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        setProducts(data);
      } catch (err) {
        console.error("TEALUXE LOAD ERROR:", err);
        setError("Failed to load tea products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2 className="products-status">Loading tea blends...</h2>;
  if (error) return <h2 className="products-error">{error}</h2>;

  return (
    <div className="products-container">
      <h1 className="products-title">Tealuxe Tea Blends</h1>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tea Name</th>
            <th>Category</th>
            <th>Price (KES)</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan={6}>No tea blends found</td>
            </tr>
          )}

          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td className="tea-name">{product.name}</td>
              <td>{product.category || "Tea"}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>

              <td className="actions">
                <button
                  className="edit-btn"
                  onClick={() => alert(`Edit ${product.name}`)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => alert(`Delete ${product.name}`)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}