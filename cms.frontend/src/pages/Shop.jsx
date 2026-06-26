import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';

function Shop({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (catParam) {
      setActiveCategoryId(parseInt(catParam));
    } else {
      setActiveCategoryId(null);
    }
  }, [catParam]);

  const handleSelectCategory = (id) => {
    if (id === null) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  const handleClearAllFilters = () => {
    searchParams.delete('category');
    searchParams.delete('search');
    setSearchParams(searchParams);
    setActiveCategoryId(null);
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="row mt-4">
      {/* Sidebar Categories */}
      <div className="col-lg-3 col-md-4 mb-4">
        <CategoryProductList 
          activeId={activeCategoryId} 
          onSelectCategory={handleSelectCategory} 
        />
      </div>

      {/* Product Grid */}
      <div className="col-lg-9 col-md-8">
        <div className="section-heading">
          <h4>Cửa Hàng Công Nghệ</h4>
          <button className="view-all-btn" onClick={handleClearAllFilters}>
            Xóa bộ lọc
          </button>
        </div>
        <ProductList 
          key={resetKey}
          activeId={activeCategoryId} 
          onSelectProduct={(p) => window.location.href = `/product/${p.id}`}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}

export default Shop;
