import { useState, useEffect } from "react";
import "./products.css";

import {
  fetchProducts,
  createProduct,
  updateProduct,
  addVariation as apiAddVariation,
  updateVariation as apiUpdateVariation,
  deleteVariation as apiDeleteVariation,
  addWeight as apiAddWeight,
  updateWeight as apiUpdateWeight,
  deleteWeight as apiDeleteWeight,
  deleteProduct as apiDeleteProduct
} from "../api/products";

export default function Products() {
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
  const handleNameChange = (id, value) => setEditedNames(prev => ({ ...prev, [id]: value }));

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
    } catch (err) { console.error(err); }
  };

  // ===== VARIATIONS & WEIGHTS =====
  const addVariation = async (productId) => {
    try { 
      await apiAddVariation({ product_id: productId, flavour: "New Flavour", image_url: "" }); 
      const res = await fetchProducts(); 
      setProducts(res.data); 
    } catch (err) { console.error(err); }
  };

  const updateVariationLocal = (productId, varId, field, value) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? {
        ...p,
        variations: p.variations.map(v => v.id === varId ? { ...v, [field]: value } : v)
      } : p)
    );
  };

  const saveVariation = async (v) => {
    try {
      await apiUpdateVariation(v.id, { flavour: v.flavour });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteVariation = async (id) => {
    try { await apiDeleteVariation(id); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  const addWeight = async (variationId) => {
    try { await apiAddWeight({ variation_id: variationId, weight: "10g", price: 10 }); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  const updateWeightLocal = (productId, varId, weightId, field, value) => {
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

  const saveWeight = async (w) => {
    try {
      await apiUpdateWeight(w.id, { weight: w.weight, price: w.price });
      const res = await fetchProducts();
      setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const deleteWeight = async (id) => {
    try { await apiDeleteWeight(id); const res = await fetchProducts(); setProducts(res.data); }
    catch (err) { console.error(err); }
  };

  // ===== RENDER =====
  return (
    <div className="products-page">
      <h2>Products</h2>
      <input 
        type="text" placeholder="Search products..." 
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 5 }}
      />
      <button onClick={handleAddProduct} style={{ marginBottom: 20 }}>+ Add Product</button>

      {filtered.map(product => (
        <div key={product.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <img src={localImages[product.id] || product.image || "https://via.placeholder.com/50"} alt="" width={50} height={50} />
            <input type="file" accept="image/*" onChange={e => {
              const file = e.target.files[0];
              if (!file) return;
              setLocalImages(prev => ({ ...prev, [product.id]: URL.createObjectURL(file) }));
              handleImageUpload(product, file);
            }} />
            <input value={editedNames[product.id] ?? product.name} onChange={e => handleNameChange(product.id, e.target.value)} />
            <span>{product.category}</span>
            <span>{product.active ? "Active" : "Inactive"}</span>
            <button onClick={() => toggleActive(product)}>{product.active ? "Deactivate" : "Activate"}</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            <button onClick={() => saveNameChange(product)}>Save</button>
            <button onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
              {expandedId === product.id ? "Close" : "Manage"}
            </button>
          </div>

          {expandedId === product.id && (
            <div style={{ marginTop: 10, paddingLeft: 20 }}>
              {product.variations.length > 0 ? product.variations.map(v => (
                <div key={v.id} style={{ border: "1px dashed #aaa", padding: 5, marginBottom: 5 }}>
                  <input value={v.flavour} onChange={e => updateVariationLocal(product.id, v.id, "flavour", e.target.value)} />
                  <button onClick={() => saveVariation(v)}>Save</button>
                  <button onClick={() => deleteVariation(v.id)}>Delete</button>

                  {(v.weights || []).map(w => (
                    <div key={w.id} style={{ display: "flex", gap: 5, marginTop: 5 }}>
                      <input value={w.weight} onChange={e => updateWeightLocal(product.id, v.id, w.id, "weight", e.target.value)} />
                      <input value={w.price} onChange={e => updateWeightLocal(product.id, v.id, w.id, "price", e.target.value)} />
                      <button onClick={() => saveWeight(w)}>Save</button>
                      <button onClick={() => deleteWeight(w.id)}>x</button>
                    </div>
                  ))}
                  <button onClick={() => addWeight(v.id)}>+ Add Weight</button>
                </div>
              )) : <p style={{ fontSize: 12, color: "#888" }}>No variations</p>}

              <button onClick={() => addVariation(product.id)}>+ Add Variation</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}