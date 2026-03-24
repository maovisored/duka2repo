import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import gsap from "gsap";
import "../App.css";
import "./Dashboard.css";

import kripsiiChilliImg from "../assets/kripsii-chilli.png";
import kripsiiBbqImg from "../assets/kripsii-bbq.png";
import kripsiiSaltedImg from "../assets/kripsii-salted.png";
import kripsiiTomatoImg from "../assets/kripsii-tomato.png";
import barbcueImg from "../assets/krackles5.jpg";
import bambaImg from "../assets/Kracles4.jpg";
import tangImg from "../assets/whatnotslogo.gif";
import chipstixImg from "../assets/chipstix.jpg"
import RipplesImg from "../assets/ripples.png"
import ToonsImg from "../assets/ola1.jpg"



const products = [
  // =======================
  // Snacks
  // =======================

  {
    id: 1,
    name: "Krackles",
    category: "Snacks",
    variations: [
      {
        flavour: "Tangy Tomato",
        image: bambaImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      },
      {
        flavour: "Bar-B-Cue",
        image: barbcueImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      }
    ]
  },

{
  id: 2,
  name: "Kripsii",
  category: "Snacks",
  variations: [
    {
      flavour: "Chilli Lemon",
      image: kripsiiChilliImg,
      weights: [
        { weight: "20g", price: 20 },
        { weight: "30g", price: 30 }
      ]
    },
    {
      flavour: "BBQ Chicken",
      image: kripsiiBbqImg,
      weights: [
        { weight: "20g", price: 20 },
        { weight: "30g", price: 30 }
      ]
    },
    {
      flavour: "Salted",
      image: kripsiiSaltedImg,
      weights: [
        { weight: "20g", price: 20 },
        { weight: "30g", price: 30 }
      ]
    },
    {
      flavour: "Tomato Ketchup",
      image: kripsiiTomatoImg,
      weights: [
        { weight: "20g", price: 20 },
        { weight: "30g", price: 30 }
      ]
    }
  ]
},

  {
    id: 3,
    name: "WhatNots",
    category: "Snacks",
    variations: [
      {
        flavour: "Original",
        image: tangImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      }
    ]
  },

  {
    id: 4,
    name: "Chipstix",
    category: "Snacks",
    variations: [
      {
        flavour: "Salted",
        image: chipstixImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      }
    ]
  },

  {
    id: 5,
    name: "Ripples",
    category: "Snacks",
    variations: [
      {
        flavour: "BBQ",
        image: RipplesImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      }
    ]
  },

  {
    id: 6,
    name: "Ola",
    category: "Snacks",
    variations: [
      {
        flavour: "Mexican Crunch",
        image: ToonsImg,
        weights: [
          { weight: "20g", price: 20 },
          { weight: "30g", price: 30 }
        ]
      }
    ]
  },



];



const categories = ["All", "Snacks"];

export default function Dashboard() {
  const { cart, setCart } = useOutletContext();
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");


  const [pullStart, setPullStart] = useState(null);
const [pullDistance, setPullDistance] = useState(0);

  const [selectedFlavour, setSelectedFlavour] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  
  

const unitPrice = selectedWeight?.price || 16;
const totalPrice = unitPrice * quantity;

useEffect(() => {
  const refreshLayout = () => {
    window.dispatchEvent(new Event("resize"));
  };

  const timer = setTimeout(refreshLayout, 200);

  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  const handleTouchMove = (e) => {
    if (selectedProduct) e.preventDefault(); // prevent scroll on background
  };
  document.body.addEventListener("touchmove", handleTouchMove, { passive: false });

  return () => document.body.removeEventListener("touchmove", handleTouchMove);
}, [selectedProduct]);

const handleTouchStart = (e) => {
  if (window.scrollY === 0) {
    setPullStart(e.touches[0].clientY);
  }
};

const handleTouchMove = (e) => {
  if (pullStart !== null) {
    const distance = e.touches[0].clientY - pullStart;

    if (distance > 0) {
      setPullDistance(distance);
    }
  }
};


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

    // GSAP fade-in modal
    gsap.fromTo(
      ".product-modal",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
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



  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
  };
  
const filteredProducts =
  products
    .filter(p => p.name === "Kripsii") // show only Kripsii
    .filter(p =>
      activeCategory === "All"
        ? true
        : p.category === activeCategory
    )
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

const openProductPopup = (product) => {
  setSelectedProduct(product);

  // FORCE salted flavour
  const saltedFlavour = product.variations.find(
    f => f.flavour.toLowerCase() === "salted"
  ) || product.variations[0];

  // FORCE 20g with price 16
  const forcedWeight = {
    weight: "20g",
    price: 16
  };

  setSelectedFlavour(saltedFlavour);
  setSelectedWeight(forcedWeight);
  setQuantity(1);
  setNotes("");
};


const confirmAddToCart = () => {
  setCart(prev => [
    ...prev,
    {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      flavour: selectedFlavour.flavour,
      weight: selectedWeight.weight,
      unitPrice,
      quantity,
      total: totalPrice,
      notes
    }
  ]);

  setSelectedProduct(null);
};
{pullDistance > 0 && (
  <div className="pull-refresh-indicator">
    ↓ Pull to refresh
  </div>
)}

  return (
    <div
  className="dashboard-container"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
>



{/* Order Now Section */}
<section className="panel order-now">
  <div className="order-bg">
    <div className="order-overlay"></div>
    <div className="order-content">
      <h2>Order Your Products Fast</h2>
      <p>Get what you need delivered to your shop with just a click.</p>
      <button className="order-btn" onClick={() => alert("Redirect to order page")}>
        Order Now
      </button>
    </div>
  </div>
</section>


{/* 
{/* Brands 
<section className="panel-brands">
  <h2>Our Brands</h2>
  <div className="brands-grid">
    {brands.map((b) => (
      <div key={b.id} className="brand-card">
        <img src={b.image} alt={b.name} />
        <span className="brand-name">{b.name}</span>
      </div>
    ))}
  </div>
</section> */}

{/* Search */}
<div className="search-wrapper">
  <input
    type="text"
    placeholder="Search products..."
    className="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>



      {/* Categories */}
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


      {/* Products */}

      <section className="panel products">
        <h2>Order Now</h2>
        <div className="product-grid">
{filteredProducts.map((p) => {
  const previewImage = p.variations[0].image;
  const previewPrice = p.variations[0].weights[0].price;

  return (
    <div key={p.id} className="product-card">
      <img src={previewImage} alt={p.name} loading="lazy" />
      <span className="product-name">{p.name}</span>
      <span className="product-price">
        From KES {previewPrice.toLocaleString()}
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
  <div
    className="modal-overlay"
    onClick={() => setSelectedProduct(null)}
  >
    <div
      className="product-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* PRODUCT IMAGE */}
      <div className="modal-image-wrapper">
        <img
          src={selectedFlavour?.image}
          alt={selectedProduct.name}
          className="modal-product-image"
        />
      </div>

      {/* TITLE */}
      <div className="modal-header-row">
        <h3>{selectedProduct.name}</h3>
      </div>

{/* FLAVOUR */}
<div className="modal-section">
  <label>Assorted Flavour</label>
  <select value="Salted" disabled>
    <option value="Salted">Salted</option>
  </select>
</div>

{/* WEIGHT */}
<div className="modal-section">
  <label>Weight (grams)</label>
  <select value="20g" disabled>
    <option value="20g">20g – KES 16</option>
  </select>
</div>

      {/* QUANTITY CARTONS */}
      <div className="modal-section">
        <label>Quantity (Cartons)</label>
        <div className="qty-controls">
          <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(q => q + 1)}>+</button>
        </div>

        {/* TOTALS */}
<div style={{ marginTop: "10px", textAlign: "right" }}>
  <span style={{ fontWeight: 600 }}>
    Unit Snacks: {quantity * 12} pcs
  </span>
  <br />
  <span style={{ fontWeight: 700, color: "var(--accent-color)" }}>
    Total: KES {(unitPrice * quantity * 12).toLocaleString()}
  </span>
</div>
      </div>

      {/* CONFIRM */}
      <button className="confirm-btn" onClick={confirmAddToCart}>
        Add Order
      </button>

    </div>
  </div>
)}

    </div>
  );
}
