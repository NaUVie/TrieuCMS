import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../api/axiosClient';

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onOpenAuth }) {
  const navigate = useNavigate();
  const [checkedItemIds, setCheckedItemIds] = useState([]);

  // Initialize checked items to all items in cart when cart loaded
  useEffect(() => {
    if (cartItems.length > 0) {
      setCheckedItemIds(prev => {
        // Keep existing checked items that are still in the cart
        const newChecked = prev.filter(id => cartItems.some(item => item.id === id));
        // Add new items that were not in the previous selection list
        cartItems.forEach(item => {
          if (!prev.includes(item.id) && !newChecked.includes(item.id)) {
            newChecked.push(item.id);
          }
        });
        return newChecked;
      });
    } else {
      setCheckedItemIds([]);
    }
  }, [cartItems]);

  const getItemPrice = (item) => {
    return item.isOnSale ? item.salePrice : item.price;
  };

  // Filter checked items
  const checkedItems = cartItems.filter(item => checkedItemIds.includes(item.id));

  // Totals for checked items only
  const totalAmount = checkedItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const checkedItemsCount = checkedItems.reduce((acc, item) => acc + item.quantity, 0);

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return BACKEND_URL + url;
    return BACKEND_URL + '/uploads/' + url;
  };

  const handleCheckoutClick = (e) => {
    e.preventDefault();
    if (!localStorage.getItem('customerId')) {
      alert('Vui lòng đăng nhập trước khi tiến hành thanh toán!');
      onOpenAuth();
      return;
    }
    if (checkedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng để thanh toán!');
      return;
    }
    // Navigate passing checkedItems only in the router state
    navigate('/checkout', { state: { checkoutItems: checkedItems } });
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4" style={{ color: '#111827' }}>
        <i className="fa-solid fa-cart-shopping text-primary me-2"></i>
        Giỏ Hàng Của Bạn
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5" style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)' }}>
          <i className="fa-solid fa-basket-shopping" style={{ fontSize: '4rem', color: '#9ca3af', marginBottom: '1.5rem' }}></i>
          <h4 className="text-muted mb-3">Giỏ hàng của bạn đang trống.</h4>
          <Link to="/shop" className="btn-register text-decoration-none d-inline-block px-4 py-2">Mua sắm ngay</Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Left Column: Items List */}
          <div className="col-lg-8">
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              
              {/* Select All Checkbox */}
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3" style={{ borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                <div className="form-check d-flex align-items-center gap-2">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    id="selectAllCartItems"
                    checked={checkedItemIds.length === cartItems.length && cartItems.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCheckedItemIds(cartItems.map(item => item.id));
                      } else {
                        setCheckedItemIds([]);
                      }
                    }}
                    style={{ cursor: 'pointer', width: '18px', height: '18px', marginTop: 0 }}
                  />
                  <label className="form-check-label fw-bold text-muted" htmlFor="selectAllCartItems" style={{ cursor: 'pointer', fontSize: '0.95rem' }}>
                    Chọn tất cả ({cartItems.length} sản phẩm)
                  </label>
                </div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  {/* Item Checkbox */}
                  <input 
                    type="checkbox" 
                    className="form-check-input"
                    style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
                    checked={checkedItemIds.includes(item.id)}
                    onChange={() => {
                      if (checkedItemIds.includes(item.id)) {
                        setCheckedItemIds(checkedItemIds.filter(id => id !== item.id));
                      } else {
                        setCheckedItemIds([...checkedItemIds, item.id]);
                      }
                    }}
                  />

                  <img 
                    src={getImageUrl(item.imageUrl)} 
                    alt={item.name} 
                    style={{ width: '80px', height: '80px', objectFit: 'contain', background: '#f9fafb', borderRadius: '12px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '1.05rem' }}>{item.name}</h5>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        {item.isOnSale ? (
                          <>
                            <span className="fw-bold text-danger me-2">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.salePrice)}
                            </span>
                            <span className="text-decoration-line-through text-muted small" style={{ fontSize: '0.8rem' }}>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </span>
                          </>
                        ) : (
                          <span className="fw-bold text-danger">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </span>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="d-flex align-items-center border rounded-pill" style={{ overflow: 'hidden', borderColor: 'rgba(0,0,0,0.12)' }}>
                        <button 
                          className="btn bg-transparent border-0 px-3"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="fw-bold px-2" style={{ fontSize: '0.9rem' }}>{item.quantity}</span>
                        <button 
                          className="btn bg-transparent border-0 px-3"
                          onClick={() => {
                            if (item.quantity >= item.stockQuantity) {
                              alert('Số lượng sản phẩm trong kho không đủ!');
                              return;
                            }
                            onUpdateQuantity(item.id, item.quantity + 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-outline-danger border-0 rounded-circle p-2"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary rounded-pill px-4" onClick={onClearCart}>
                  Xóa toàn bộ giỏ
                </button>
                <Link to="/shop" className="btn-clean-outline text-decoration-none px-4 py-2" style={{ lineHeight: 'normal' }}>
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Totals & Checkout */}
          <div className="col-lg-4">
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h4 className="fw-bold mb-4" style={{ color: '#1f2937' }}>Tóm tắt đơn hàng</h4>
              
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '1.05rem', color: '#4b5563' }}>
                <span>Đã chọn ({checkedItemsCount} sản phẩm):</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-4" style={{ fontSize: '1.05rem', color: '#4b5563' }}>
                <span>Phí vận chuyển:</span>
                <span className="text-success fw-bold">Miễn phí</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4 mt-4" style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                <span>Tổng cộng:</span>
                <span className="text-danger">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                </span>
              </div>

              <button 
                onClick={handleCheckoutClick}
                className="auth-submit-btn text-center d-block w-100 text-decoration-none border-0"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)', margin: 0, lineHeight: '2.5rem', borderRadius: '12px', fontWeight: 'bold' }}
              >
                Tiến Hành Thanh Toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
