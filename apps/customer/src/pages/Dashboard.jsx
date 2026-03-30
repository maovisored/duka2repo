import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gsap from "gsap";
import "../App.css";
import "./Dashboard.css";

const categories = ["All", "Snacks"];

export default function Dashboard() {
  // =========================
  // STATE
  // =========================
  const [products] = useState([]);
  const { cart, setCart } = useOutletContext();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pullStart, setPullStart] = useState(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // =========================
  // PRICING
  // =========================
  const unitPrice = Number(selectedWeight?.price || 0);

// fetch products
fetch("/api/products")  // or "/api/full" if you keep Option A
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

  // =========================
  // UI EFFECTS
  // =========================
  useEffect(() => {
    const refreshLayout = () => window.dispatchEvent(new Event("resize"));
    const timer = setTimeout(refreshLayout, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (selectedProduct) e.preventDefault();
    };
    document.body.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () =>
      document.body.removeEventListener("touchmove", handleTouchMove);
  }, [selectedProduct]);

  useEffect(() => {
    gsap.from(".hero", { y: -50, opacity: 0, duration: 0.8 });
    window.addEventListener("load", () => {
      gsap.from(".product-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
      });
    });
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add("modal-open");
      gsap.fromTo(
        ".product-modal",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(
        ".modal-overlay",
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [selectedProduct]);

  // =========================
  // TOUCH HANDLERS
  // =========================
  const handleTouchStart = (e) => {
    if (window.scrollY === 0) setPullStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (pullStart !== null) {
      const distance = e.touches[0].clientY - pullStart;
      if (distance > 0) setPullDistance(distance);
    }
  };

  // =========================
  // FILTERING
  // =========================
  const filteredProducts = products
    .filter((p) => p.active)
    .filter((p) => (activeCategory === "All" ? true : p.category === activeCategory))
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // =========================
  // PRODUCT ACTIONS
  // =========================
  const openProductPopup = (product) => {
    setSelectedProduct(product);
    const firstVar = product.variations?.[0];
    const firstWeight = firstVar?.weights?.[0];
    setSelectedFlavour(firstVar || null);
    setSelectedWeight(firstWeight || null);
    setQuantity(1);
    setNotes("");
  };

  const confirmAddToCart = () => {
    setCart((prev) => [
      ...prev,
      {
        productId: selectedProduct.id,
        variationId: selectedFlavour.id,
        weightId: selectedWeight.id,
        name: selectedProduct.name,
        flavour: selectedFlavour.flavour,
        weight: selectedWeight.weight,
        unitPrice,
        quantity,
        total: unitPrice * quantity,
        notes
      }
    ]);
    setSelectedProduct(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      className="dashboard-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {pullDistance > 0 && (
        <div className="pull-refresh-indicator">↓ Pull to refresh</div>
      )}

      <div className="search-wrapper">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <section className="categories">
        <div className="categories-scroll">
          {categories.map((c, i) => (
            <button
              key={i}
              className={`category-btn ${activeCategory === c ? "active" : ""}`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="panel products">
        <h2>Order Now</h2>
        <div className="product-grid">
          {filteredProducts.map((p) => {
            const firstVar = p.variations?.[0];
            const firstWeight = firstVar?.weights?.[0];
            const previewImage = firstVar?.image_url || "./kripsii-chilli.png";
            const previewPrice = firstWeight?.price || 0;

            return (
              <div key={p.id} className="product-card">
                <img src={previewImage} alt={p.name} />
                <span className="product-name">{p.name}</span>
                <span className="product-price">
                  From KES {Number(previewPrice).toLocaleString()}
                </span>
                <button className="add-cart" onClick={() => openProductPopup(p)}>
                  Order
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {cart.length > 0 && (
        <div className="floating-cart" onClick={() => navigate("/cart")}>
          🛒 {cart.length}
        </div>
      )}

      <button className="theme-switch" onClick={toggleTheme}>
        {darkMode ? "☀️" : "🌙"}
      </button>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedFlavour?.image_url || "../assets/kripsii-chilli.png"}
              alt=""
              className="modal-product-image"
            />
            <h3>{selectedProduct.name}</h3>

            <select
              value={selectedFlavour?.id || ""}
              onChange={(e) => {
                const flavour = selectedProduct.variations.find(
                  (v) => v.id === Number(e.target.value)
                );
                setSelectedFlavour(flavour);
                setSelectedWeight(flavour?.weights?.[0]);
              }}
            >
              {selectedProduct.variations.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.flavour}
                </option>
              ))}
            </select>

            <select
              value={selectedWeight?.id || ""}
              onChange={(e) => {
                const weight = selectedFlavour.weights.find(
                  (w) => w.id === Number(e.target.value)
                );
                setSelectedWeight(weight);
              }}
            >
              {selectedFlavour?.weights?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.weight} – KES {Number(w.price).toLocaleString()}
                </option>
              ))}
            </select>

            <div className="qty-controls">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <div style={{ textAlign: "right", marginTop: 10 }}>
              <strong>Total: KES {(unitPrice * quantity).toLocaleString()}</strong>
            </div>

            <button className="confirm-btn" onClick={confirmAddToCart}>
              Add Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}