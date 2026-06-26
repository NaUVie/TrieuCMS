import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const ProductGrid = ({ 
  title, 
  iconClass, 
  products, 
  quantities, 
  setQuantities, 
  onAddToCart, 
  BACKEND_URL, 
  navigate 
}) => {
  const { showToast } = useToast();
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) setItemsPerRow(1);
      else if (width < 768) setItemsPerRow(2);
      else if (width < 992) setItemsPerRow(3);
      else if (width < 1200) setItemsPerRow(4);
      else setItemsPerRow(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!products || products.length === 0) return null;

  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIndex(prev => Math.min(prev + 1, products.length - itemsPerRow));
  };

  // Safe translation to prevent index overflow on resize
  const safeStartIndex = Math.min(startIndex, Math.max(0, products.length - itemsPerRow));

  return (
    <div className="mb-5">
      <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4><i className={`${iconClass} me-2`}></i>{title}</h4>
      </div>

      <div className="product-slider-container">
        {/* Left Arrow Button */}
        {products.length > itemsPerRow && (
          <button 
            onClick={handlePrev} 
            disabled={safeStartIndex === 0}
            className="slider-arrow-btn"
            style={{
              position: 'absolute',
              left: '-20px',
              zIndex: 10,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: safeStartIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: safeStartIndex === 0 ? 0.3 : 1
            }}
          >
            <i className="fa-solid fa-chevron-left" style={{ color: '#374151', fontSize: '0.9rem' }}></i>
          </button>
        )}

        {/* Slider Track Wrapper */}
        <div className="product-slider-track-wrapper">
          <div 
            className="product-slider-track"
            style={{
              transform: products.length > itemsPerRow ? `translateX(calc(-1 * ${safeStartIndex} * (100% + var(--gap)) / var(--items-per-row)))` : 'none',
              justifyContent: products.length < itemsPerRow ? 'center' : 'flex-start'
            }}
          >
            {products.map(product => (
              <div 
                key={product.id} 
                className="product-slider-item"
                style={products.length < itemsPerRow ? {
                  flex: '0 1 240px',
                  minWidth: '200px',
                  maxWidth: '280px'
                } : {}}
              >
                <div className="product-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Link to={`/product/${product.id}`}>
                    <div className="product-img-wrapper" style={{ padding: 0 }}>
                      {product.isOnSale ? (
                        <span className="product-badge" style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>
                          -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                        </span>
                      ) : (
                        <span className="product-badge" style={{ background: '#10b981' }}>New</span>
                      )}
                      <img src={product.imageUrl?.startsWith('/') ? BACKEND_URL + product.imageUrl : product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop'} alt={product.name} className="product-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </Link>
                  <div className="product-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '12px' }}>
                    <h5 className="product-name" style={{ fontSize: '0.85rem', marginBottom: '8px', minHeight: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.3' }}>
                      <Link to={`/product/${product.id}`} style={{ color: '#1f2937', textDecoration: 'none', fontWeight: '700' }}>{product.name}</Link>
                    </h5>
                    <p className="product-price" style={{ margin: '0 0 12px 0', fontSize: '0.8rem' }}>
                      {product.isOnSale ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.75rem', marginRight: '6px', fontWeight: '500' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                          </span>
                          <span style={{ color: '#ef4444', fontWeight: '800' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                          </span>
                        </>
                      ) : (
                        <span style={{ color: '#4f46e5', fontWeight: '800' }}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </span>
                      )}
                    </p>
                    
                    <div className="d-flex align-items-center justify-content-between mb-3" style={{ width: '100%', marginTop: 'auto' }}>
                      <p className="product-stock" style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                        <i className="fa-solid fa-box-open mr-1"></i> Tồn: {product.stockQuantity}
                      </p>
                      {product.stockQuantity > 0 && (
                        <div className="d-flex align-items-center" style={{ gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                          <button 
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                            style={{ width: '20px', height: '20px', padding: 0 }}
                            onClick={(e) => {
                              e.preventDefault();
                              const currentQty = quantities[product.id] || 1;
                              if (currentQty > 1) {
                                setQuantities({ ...quantities, [product.id]: currentQty - 1 });
                              }
                            }}
                          >
                            -
                          </button>
                          <input 
                            type="text" 
                            className="form-control form-control-sm text-center" 
                            style={{ width: '28px', height: '20px', padding: 0, fontSize: '0.75rem', fontWeight: 'bold' }} 
                            value={quantities[product.id] || 1}
                            readOnly 
                          />
                          <button 
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                            style={{ width: '20px', height: '20px', padding: 0 }}
                            onClick={(e) => {
                              e.preventDefault();
                              const currentQty = quantities[product.id] || 1;
                              if (currentQty < product.stockQuantity) {
                                setQuantities({ ...quantities, [product.id]: currentQty + 1 });
                              } else {
                                showToast(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho!`, 'warning');
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-2 w-100" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-outline-primary btn-sm flex-fill" 
                        style={{ borderRadius: '8px', height: '32px', fontSize: '0.75rem', fontWeight: 'bold' }}
                        onClick={(e) => {
                          e.preventDefault();
                          const qty = quantities[product.id] || 1;
                          const success = onAddToCart(product, qty);
                          if (success !== false) {
                            navigate('/checkout');
                          }
                        }}
                        disabled={product.stockQuantity === 0}
                      >
                        Mua ngay
                      </button>
                      <button 
                        className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" 
                        style={{ borderRadius: '8px', height: '32px', fontSize: '0.75rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none' }}
                        onClick={(e) => {
                          e.preventDefault();
                          const qty = quantities[product.id] || 1;
                          onAddToCart(product, qty);
                        }}
                        disabled={product.stockQuantity === 0}
                      >
                        <i className="fa-solid fa-cart-plus" style={{ fontSize: '0.75rem' }}></i> Thêm giỏ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {products.length > itemsPerRow && (
          <button 
            onClick={handleNext} 
            disabled={safeStartIndex >= products.length - itemsPerRow}
            className="slider-arrow-btn"
            style={{
              position: 'absolute',
              right: '-20px',
              zIndex: 10,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid rgba(0,0,0,0.1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: safeStartIndex >= products.length - itemsPerRow ? 'not-allowed' : 'pointer',
              opacity: safeStartIndex >= products.length - itemsPerRow ? 0.3 : 1
            }}
          >
            <i className="fa-solid fa-chevron-right" style={{ color: '#374151', fontSize: '0.9rem' }}></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
