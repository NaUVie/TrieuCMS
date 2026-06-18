import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryProductList from '../components/CategoryProductList';
import ProductList from '../components/ProductList';

function Shop({ onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('category');
  
  const [activeCategoryId, setActiveCategoryId] = useState(null);

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
          <button className="view-all-btn" onClick={() => handleSelectCategory(null)}>
            Xóa bộ lọc danh mục
          </button>
        </div>
        <ProductList 
          activeId={activeCategoryId} 
          onSelectProduct={(p) => window.location.href = `/product/${p.id}`}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}

export default Shop;
