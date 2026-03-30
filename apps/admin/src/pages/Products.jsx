// src/pages/Admin/ProductsAdmin.jsx
import { useState, useEffect } from "react";
import "./products.css";
import "../App.css";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  addVariation as apiAddVariation,
  deleteVariation as apiDeleteVariation,
  updateVariation as apiUpdateVariation,
  addWeight as apiAddWeight,
  deleteWeight as apiDeleteWeight,
  updateWeight as apiUpdateWeight,
  deleteProduct as apiDeleteProduct
} from "../../api/full";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editedNames, setEditedNames] = useState({});
  const [localImages, setLocalImages] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        const safeData = (res.data || []).map(p => ({
          ...p,
          name: p.name || "",
          category: p.category || "",
          image: p.image || "",
          active: p.active ?? true,
          variations: (p.variations || []).map(v => ({
            ...v,
            flavour: v.flavour || "",
            weights: (v.weights || []).map(w => ({
              ...w,
              weight: w.weight || "",
              price: w.price ?? 0
            }))
          }))
        }));
        setProducts(safeData);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      }
    };
    loadProducts();
  }, []);

  const filtered = products.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ===== PRODUCT ACTIONS =====
  const handleNameChange = (id, value) => {
    setEditedNames(prev => ({ ...prev, [id]: value }));
  };

  const saveNameChange = async (product) => {
    if (!editedNames[product.id]) return;
    try {
      await updateProduct(product.id, { name: editedNames[product.id], active: product.active });
      const res = await fetchProducts();
      setProducts(res.data);
      setEditedNames(prev => ({ ...prev, [product.id]: "" }));
    } catch (err) { console.error(err); }
  };

  const toggleActive = async (product) => {
    try {
      await updateProduct(product.id, { name: product.name, active: !product.active });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async () => {
    try {
      await createProduct({ name: "New Product", category: "Snacks" });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await apiDeleteProduct(id);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = async (product, file) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("active", product.active);
    formData.append("image", file);

    try {
      await updateProduct(product.id, formData, true);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== VARIATIONS & WEIGHTS =====
  const addVariation = async (productId) => {
    try {
      await apiAddVariation({ product_id: productId, flavour: "New Flavour", image_url: "" });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const updateVariation = (productId, varId, field, value) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? {
        ...p,
        variations: p.variations.map(v => v.id === varId ? { ...v, [field]: value } : v)
      } : p)
    );
  };

  const saveVariation = async (variation) => {
    try {
      await apiUpdateVariation(variation.id, { flavour: variation.flavour });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteVariation = async (varId) => {
    try {
      await apiDeleteVariation(varId);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const addWeight = async (variationId) => {
    try {
      await apiAddWeight({ variation_id: variationId, weight: "10g", price: 10 });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const updateWeight = (productId, varId, weightId, field, value) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? {
        ...p,
        variations: p.variations.map(v => v.id === varId ? {
          ...v,
          weights: v.weights.map(w => w.id === weightId ? { ...w, [field]: value } : w)
        } : v)
      } : p)
    );
  };

  const deleteWeight = async (weightId) => {
    try {
      await apiDeleteWeight(weightId);
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const saveWeight = async (w) => {
    try {
      await apiUpdateWeight(w.id, { weight: w.weight, price: w.price });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  // ===== RENDER =====
  return (
    <div className="products-page orders-page">
      <div className="orders-header">
        <h2>Products</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="orders-table">
        <div className="table-header">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Status</span>
          <span>Manage</span>
          <span>Actions</span>
        </div>

        {filtered.map(product => (
          <div key={product.id} className="table-row">

            <div className="product-left">
              <img
                src={localImages[product.id] || product.image || "https://via.placeholder.com/50"}
              />
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setLocalImages(prev => ({ ...prev, [product.id]: URL.createObjectURL(file) }));
                  handleImageUpload(product, file);
                }}
              />
            </div>

            <div>
              <input
                value={editedNames[product.id] ?? product.name}
                onChange={e => handleNameChange(product.id, e.target.value)}
              />
            </div>

            <div>{product.category}</div>

            <div className={product.active ? "status confirmed" : "status cancelled"}>
              {product.active ? "Active" : "Inactive"}
            </div>

            <div>
              <button onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                {expandedId === product.id ? "Close" : "Manage"}
              </button>
            </div>

            <div className="actions">
              <button onClick={() => toggleActive(product)}>{product.active ? "Deactivate" : "Activate"}</button>
              <button className="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              <button onClick={() => saveNameChange(product)}>Save</button>
            </div>

            {expandedId === product.id && (
              <div className="order-details">
                {product.variations?.length ? product.variations.map(v => (
                  <div key={v.id} className="variation-card">
                    <div className="variation-header">
                      <input
                        value={v.flavour}
                        onChange={e => updateVariation(product.id, v.id, "flavour", e.target.value)}
                      />
                      <div className="actions">
                        <button onClick={() => saveVariation(v)}>Save</button>
                        <button className="danger" onClick={() => deleteVariation(v.id)}>Delete</button>
                      </div>
                    </div>

                    <div className="weights">
                      {v.weights?.map(w => (
                        <div key={w.id} className="weight-row">
                          <input
                            value={w.weight}
                            onChange={e => updateWeight(product.id, v.id, w.id, "weight", e.target.value)}
                          />
                          <input
                            value={w.price}
                            onChange={e => updateWeight(product.id, v.id, w.id, "price", e.target.value)}
                          />
                          <div className="actions">
                            <button onClick={() => saveWeight(w)}>Save</button>
                            <button className="danger" onClick={() => deleteWeight(w.id)}>x</button>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => addWeight(v.id)}>+ Add Weight</button>
                    </div>
                  </div>
                )) : <p style={{ fontSize: 12, color: "#888" }}>No variations</p>}

                <div className="detail-actions">
                  <button onClick={() => addVariation(product.id)}>+ Add Variation</button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="detail-actions">
          <button className="add-product" onClick={handleAddProduct}>+ Add Product</button>
        </div>
      </div>
    </div>
  );
}