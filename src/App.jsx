import React, { useState, useEffect, useMemo } from 'react';
import { FilterSidebar, ProductCard } from './olma';
import './index.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtr holatlari (States)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('default');
  const [cartCount, setCartCount] = useState(0);

  // FakeStore API dan ma'lumot olish
  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => {
        if (!res.ok) throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Unikal kategoriyalarni ajratib olish
  const categories = useMemo(() => {
    return [...new Set(products.map((item) => item.category))];
  }, [products]);

  // Kategoriya tanlash/bekor qilish
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Filtrlarni tozalash
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy('default');
  };

  // Mahsulotlarni filtrlash va saralash
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category);
        const matchesPrice = product.price <= maxPrice;
        const matchesRating = (product.rating?.rate || 0) >= minRating;

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategories, maxPrice, minRating, sortBy]);

  return (
    <div className="app-container">
      {/* Yuqori Navbar */}
      <header className="navbar">
        <div className="logo">
          🛍️ <span>MegaStore</span>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Mahsulot nomini qidiring..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="cart-badge">
          🛒 Savatcha: <strong>{cartCount}</strong>
        </div>
      </header>

      {/* Asosiy kontent */}
      <main className="main-layout">
        <FilterSidebar
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          onReset={handleResetFilters}
        />

        <section className="products-section">
          <div className="products-topbar">
            <p className="results-count">
              Topildi: <strong>{filteredProducts.length}</strong> ta mahsulot
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Saralash: Standart</option>
              <option value="price-asc">Narx: Arzondan qimmatga</option>
              <option value="price-desc">Narx: Qimmatdan arzonga</option>
              <option value="rating">Eng yuqori reyting</option>
            </select>
          </div>

          {loading && <div className="status-msg">Mahsulotlar yuklanmoqda...</div>}
          {error && <div className="status-msg error">{error}</div>}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="status-msg">
              Siz tanlagan filtrlar bo'yicha mahsulot topilmadi.
            </div>
          )}

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => setCartCount((c) => c + 1)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}