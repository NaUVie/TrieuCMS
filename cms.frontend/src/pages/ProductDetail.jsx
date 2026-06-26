import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { BACKEND_URL } from '../api/axiosClient';

function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
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
    <div className="container mt-5">
      <nav aria-label="breadcrumb" style={{ marginBottom: '2rem' }}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          <li className="breadcrumb-item"><Link to="/shop">Cửa hàng</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

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
                      alert(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho!`);
                    }
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="d-flex gap-3 pt-2">
            <button 
              className="btn btn-primary" 
              style={{ flex: 2, padding: '12px 30px', borderRadius: '15px', fontWeight: 'bold', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none' }}
              onClick={() => {
                const success = onAddToCart(product, qty);
                if (success !== false) {
                  navigate('/checkout');
                }
              }}
              disabled={product.stockQuantity === 0}
            >
              <i className="fa-solid fa-bolt me-2"></i> Mua Ngay
            </button>
            <button 
              className="btn btn-outline-primary" 
              style={{ flex: 2, padding: '12px 30px', borderRadius: '15px', fontWeight: 'bold' }}
              onClick={() => onAddToCart(product, qty)}
              disabled={product.stockQuantity === 0}
            >
              <i className="fa-solid fa-cart-plus me-2"></i> Thêm Vào Giỏ Hàng
            </button>
            <Link to="/shop" className="btn-login" style={{ flex: 1, textAlign: 'center', lineHeight: '2.8rem', borderRadius: '15px', textDecoration: 'none' }}>
              Trở lại cửa hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
