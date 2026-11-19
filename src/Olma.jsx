import React from 'react';

// Chap tarafdagi filtrlar paneli komponenti
export function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  onReset
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Filtrlar</h2>
        <button onClick={onReset} className="reset-btn">
          Tozalash
        </button>
      </div>

      {/* Kategoriya / Brend bo'yicha filtr */}
      <div className="filter-group">
        <h3>Kategoriyalar (Brendlar)</h3>
        <div className="checkbox-list">
          {categories.map((cat) => (
            <label key={cat} className="checkbox-item">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => onCategoryChange(cat)}
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Narx bo'yicha filtr */}
      <div className="filter-group">
        <h3>Maksimal narx: ${maxPrice}</h3>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="price-slider"
        />
        <div className="price-labels">
          <span>$10</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Reyting bo'yicha filtr */}
      <div className="filter-group">
        <h3>Minimal reyting</h3>
        <div className="rating-options">
          {[4, 3, 2, 0].map((rate) => (
            <button
              key={rate}
              className={`rating-btn ${minRating === rate ? 'active' : ''}`}
              onClick={() => setMinRating(rate)}
            >
              {rate === 0 ? 'Barchasi' : `${rate} ★ va yuqori`}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Mahsulot kartochkasi komponenti
export function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-badge">{product.category}</div>
      <div className="product-image-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="product-info">
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>
        <div className="product-rating">
          <span>⭐ {product.rating?.rate}</span>
          <span className="rating-count">({product.rating?.count} ta sharh)</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            + Savatga
          </button>
        </div>
      </div>
    </div>
  );
}