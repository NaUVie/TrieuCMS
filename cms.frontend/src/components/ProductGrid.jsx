import React from 'react';
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
  if (!products || products.length === 0) return null;

  return (
    <div className="mb-5">
      <div className="section-heading">
        <h4><i className={`${iconClass} me-2`}></i>{title}</h4>
      </div>
      <div className="row g-4">
        {products.map(product => (
          <div key={product.id} className="col-md-4">
            <div className="product-card">
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
              <div className="product-body">
                <h5 className="product-name"><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                <p className="product-price" style={{ margin: '0 0 12px 0' }}>
                  {product.isOnSale ? (
                    <>
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem', marginRight: '10px', fontWeight: '500' }}>
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
                
                <div className="d-flex align-items-center justify-content-between mb-2" style={{ width: '100%' }}>
                  <p className="product-stock" style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                    <i className="fa-solid fa-box-open mr-1"></i> Tồn: {product.stockQuantity}
                  </p>
                  {product.stockQuantity > 0 && (
                    <div className="d-flex align-items-center" style={{ gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                        style={{ width: '24px', height: '24px', padding: 0 }}
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
                        style={{ width: '32px', height: '24px', padding: 0, fontSize: '0.8rem', fontWeight: 'bold' }} 
                        value={quantities[product.id] || 1}
                        readOnly 
                      />
                      <button 
                        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                        style={{ width: '24px', height: '24px', padding: 0 }}
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

                <div className="d-flex gap-2 w-100" style={{ marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="btn btn-outline-primary btn-sm flex-fill" 
                    style={{ borderRadius: '8px', height: '36px', fontSize: '0.8rem', fontWeight: 'bold' }}
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
                    style={{ borderRadius: '8px', height: '36px', fontSize: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none' }}
                    onClick={(e) => {
                      e.preventDefault();
                      const qty = quantities[product.id] || 1;
                      onAddToCart(product, qty);
                    }}
                    disabled={product.stockQuantity === 0}
                  >
                    <i className="fa-solid fa-cart-plus"></i> Thêm giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
