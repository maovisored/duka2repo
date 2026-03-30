import { useState, useEffect } from "react";
import "./products.css";

// API
import {
  fetchProducts,
  createProduct,
  updateProduct,
  addVariation as apiAddVariation,
  deleteVariation as apiDeleteVariation,
  addWeight as apiAddWeight,
  deleteWeight as apiDeleteWeight,
  deleteProduct as apiDeleteProduct
} from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editedNames, setEditedNames] = useState({});
  const [localImages, setLocalImages] = useState({}); // store local image previews

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // PRODUCT ACTIONS
  // =========================
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

  const handleImageChange = (id, file) => {
    const url = URL.createObjectURL(file);
    setLocalImages(prev => ({ ...prev, [id]: url }));
    // optional: upload file via API
  };

  // =========================
  // VARIATIONS & WEIGHTS
  // =========================
  const addVariation = async (productId) => {
    try { await apiAddVariation({ product_id: productId, flavour: "New Flavour", image_url: "" }); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  const updateVariation = (productId, varId, field, value) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? {
        ...p,
        variations: p.variations.map(v => v.id === varId ? { ...v, [field]: value } : v)
      } : p)
    );
  };

  const deleteVariation = async (varId) => {
    try { await apiDeleteVariation(varId); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  const addWeight = async (variationId) => {
    try { await apiAddWeight({ variation_id: variationId, weight: "10g", price: 10 }); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
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
    try { await apiDeleteWeight(weightId); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div className="products-page orders-page">
      <div className="orders-header">
        <h2>Products</h2>
        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
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
            {/* IMAGE */}
            <div className="product-left">
              <img src={localImages[product.id] || product.image} alt="" />
              <input type="file" accept="image/*" onChange={e => handleImageChange(product.id, e.target.files[0])} />
            </div>

            {/* NAME */}
            <div>
              <input
                value={editedNames[product.id] ?? product.name}
                onChange={e => handleNameChange(product.id, e.target.value)}
              />
            </div>

            {/* CATEGORY */}
            <div>{product.category}</div>

            {/* STATUS */}
            <div className={product.active ? "status confirmed" : "status cancelled"}>
              {product.active ? "Active" : "Inactive"}
            </div>

            {/* MANAGE */}
            <div>
              <button onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                {expandedId === product.id ? "Close" : "Manage"}
              </button>
            </div>

            {/* ACTIONS */}
            <div className="actions">
              <button onClick={() => toggleActive(product)}>{product.active ? "Deactivate" : "Activate"}</button>
              <button className="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              <button onClick={() => saveNameChange(product)}>Save</button>
            </div>

            {/* EXPANDED VARIATIONS */}
            {expandedId === product.id && (
              <div className="order-details">
                {product.variations.map(v => (
                  <div key={v.id} className="variation-card">
                    <div className="variation-header">
                      <input
                        value={v.flavour}
                        onChange={e => updateVariation(product.id, v.id, "flavour", e.target.value)}
                      />
                      <button className="danger" onClick={() => deleteVariation(v.id)}>Delete</button>
                    </div>

                    <div className="weights">
                      {v.weights.map(w => (
                        <div key={w.id} className="weight-row">
                          <input
                            value={w.weight}
                            onChange={e => updateWeight(product.id, v.id, w.id, "weight", e.target.value)}
                          />
                          <input
                            value={w.price}
                            onChange={e => updateWeight(product.id, v.id, w.id, "price", e.target.value)}
                          />
                          <button className="danger" onClick={() => deleteWeight(w.id)}>x</button>
                        </div>
                      ))}
                      <button onClick={() => addWeight(v.id)}>+ Add Weight</button>
                    </div>
                  </div>
                ))}

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