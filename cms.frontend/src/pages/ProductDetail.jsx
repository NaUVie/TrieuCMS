import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { BACKEND_URL } from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

function ProductDetail({ onAddToCart, onOpenAuth }) {
  const { id } = useParams();
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        
        const allProds = await productService.getAllProducts();
        if (allProds && data) {
          const related = allProds
            .filter(p => p.categoryProductId === data.categoryProductId && p.id !== data.id)
            .slice(0, 4); // GIỚI HẠN: Số sản phẩm TƯƠNG TỰ hiển thị ở trang Chi tiết (mặc định lấy 4)
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner py-5">
        <i className="fa-solid fa-spinner"></i> Đang tải thông tin sản phẩm...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Không tìm thấy sản phẩm này trong hệ thống.</h4>
        <Link to="/shop" className="btn-login mt-3 d-inline-block text-decoration-none">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const imageUrl = product.imageUrl?.startsWith('/') ? BACKEND_URL + product.imageUrl : product.imageUrl;

  return (
    <div className="container mt-4">
      {/* Breadcrumb at the very top */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb" style={{ margin: 0, padding: 0 }}>
          <li className="breadcrumb-item"><Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/shop" style={{ color: '#64748b', textDecoration: 'none' }}>Cửa hàng</Link></li>
          <li className="breadcrumb-item active" style={{ color: '#1e293b', fontWeight: '500' }}>{product.name}</li>
        </ol>
      </nav>

      {/* Back button row below breadcrumb */}
      <div className="mb-4" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
        <Link 
          to="/shop" 
          style={{ 
            textDecoration: 'none', 
            color: '#4f46e5', 
            fontWeight: '600', 
            fontSize: '0.875rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#f5f3ff',
            border: '1px solid #e0dcfc',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#e0dcfc';
            e.currentTarget.style.transform = 'translateX(-3px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#f5f3ff';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay lại cửa hàng
        </Link>
      </div>

      <div className="row g-5">
        {/* Left Column: Image */}
        <div className="col-md-6 text-center">
          <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <img 
              src={imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop'} 
              alt={product.name} 
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="col-md-6">
          <h1 className="fw-bold" style={{ color: '#111827', fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          
          {product.isOnSale ? (
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="fw-bold" style={{ color: '#ef4444', fontSize: '2.2rem' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
              </span>
              <span className="text-decoration-line-through text-muted ms-3" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </span>
              <span className="badge bg-danger ms-3 text-white" style={{ fontSize: '0.85rem', padding: '6px 12px', borderRadius: '8px', verticalAlign: 'middle' }}>
                GIẢM GIÁ
              </span>
            </div>
          ) : (
            <h2 className="fw-bold" style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1.5rem' }}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </h2>
          )}

          <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
            <h5 className="fw-bold text-slate mb-2">Mô Tả Sản Phẩm:</h5>
            <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '1.05rem' }}>
              {product.description || 'Sản phẩm công nghệ cao cấp chính hãng. Cung cấp hiệu năng vượt trội, thiết kế sang trọng và trải nghiệm tối ưu cho người sử dụng.'}
            </p>
          </div>

          <div className="detail-meta mb-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="detail-meta-item">
              <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '8px' }}></i>
              <span>Trạng thái: <strong>{product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}</strong></span>
            </div>
            <div className="detail-meta-item">
              <i className="fa-solid fa-box" style={{ color: '#4f46e5', marginRight: '8px' }}></i>
              <span>Tồn kho: <strong>{product.stockQuantity} sản phẩm</strong></span>
            </div>
            <div className="detail-meta-item">
              <i className="fa-solid fa-shield-halved" style={{ color: '#4f46e5', marginRight: '8px' }}></i>
              <span>Bảo hành: <strong>12 tháng chính hãng</strong></span>
            </div>
            <div className="detail-meta-item">
              <i className="fa-solid fa-truck-fast" style={{ color: '#4f46e5', marginRight: '8px' }}></i>
              <span>Giao hàng: <strong>Miễn phí toàn quốc</strong></span>
            </div>
          </div>

          {product.stockQuantity > 0 && (
            <div className="d-flex align-items-center mb-4" style={{ gap: '15px' }}>
              <span className="fw-bold text-slate" style={{ fontSize: '1.05rem' }}>Số lượng mua:</span>
              <div className="input-group" style={{ width: '130px' }}>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button" 
                  onClick={() => { if (qty > 1) setQty(qty - 1); }}
                >
                  -
                </button>
                <input 
                  type="text" 
                  className="form-control text-center" 
                  style={{ fontWeight: 'bold' }} 
                  value={qty} 
                  readOnly 
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button" 
                  onClick={() => {
                    if (qty < product.stockQuantity) {
                      setQty(qty + 1);
                    } else {
                      showToast(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho!`, 'warning');
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 pt-2" style={{ maxWidth: '420px' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1, padding: '10px 20px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none' }}
              onClick={() => {
                if (!localStorage.getItem('customerId')) {
                  showToast('Vui lòng đăng nhập trước khi mua hàng!', 'warning');
                  onOpenAuth();
                  return;
                }
                const success = onAddToCart(product, qty);
                if (success !== false) {
                  navigate('/checkout', { state: { checkoutItems: [{ ...product, quantity: qty }] } });
                }
              }}
              disabled={product.stockQuantity === 0}
            >
              <i className="fa-solid fa-bolt me-2"></i> Mua Ngay
            </button>
            <button 
              className="btn btn-outline-primary" 
              style={{ flex: 1, padding: '10px 20px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '600', borderColor: '#4f46e5', color: '#4f46e5' }}
              onClick={() => onAddToCart(product, qty)}
              disabled={product.stockQuantity === 0}
            >
              <i className="fa-solid fa-cart-plus me-2"></i> Thêm Vào Giỏ
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-5 pt-5 mb-5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <h3 className="fw-bold mb-4" style={{ color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '4px', height: '24px', background: 'linear-gradient(135deg, #4f46e5, #db2777)', borderRadius: '4px', display: 'inline-block' }}></span>
            Sản phẩm tương tự
          </h3>
          <div className="row g-4">
            {relatedProducts.map((p) => {
              const pUrl = p.imageUrl?.startsWith('/') ? BACKEND_URL + p.imageUrl : p.imageUrl;
              return (
                <div key={p.id} className="col-lg-3 col-md-4 col-sm-6">
                  <Link to={`/product/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="related-product-card" style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.06)',
                      borderRadius: '16px',
                      padding: '16px',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}>
                      <div>
                        <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', background: '#f8fafc', borderRadius: '12px', padding: '10px' }}>
                          <img
                            src={pUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                            alt={p.name}
                            style={{ maxHeight: '140px', maxWidth: '100%', objectFit: 'contain', transition: 'transform 0.3s' }}
                            className="related-prod-img"
                          />
                        </div>
                        <h6 style={{
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.5rem',
                          lineHeight: '1.35'
                        }} title={p.name}>
                          {p.name}
                        </h6>
                      </div>
                      <div>
                        <div style={{ marginBottom: '12px' }}>
                          {p.isOnSale ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#ef4444' }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.salePrice)}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#111827' }}>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                            </span>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary w-100"
                          style={{ borderRadius: '8px', fontSize: '0.775rem', padding: '6px 12px', borderColor: '#4f46e5', color: '#4f46e5', fontWeight: '600', background: 'transparent' }}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
          <style>{`
            .related-product-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 12px 24px rgba(79, 70, 229, 0.08) !important;
              border-color: #4f46e5 !important;
            }
            .related-product-card:hover .related-prod-img {
              transform: scale(1.05);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
