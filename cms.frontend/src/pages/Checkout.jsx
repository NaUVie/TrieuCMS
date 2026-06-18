import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../services/orderService';

function Checkout({ cartItems, onClearCart }) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({
      fullName: localStorage.getItem('customerName') || '',
      phone: localStorage.getItem('customerPhone') || '',
      address: localStorage.getItem('customerAddress') || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleFormChange = (e) => {
      setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');

      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
          setError('Bạn cần đăng nhập để đặt hàng!');
          return;
      }

      if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
          setError('Vui lòng nhập đầy đủ thông tin giao hàng bắt buộc (Họ tên, Số điện thoại, Địa chỉ)!');
          return;
      }

      setLoading(true);

      try {
          const orderData = {
              customerId: parseInt(customerId),
              notes: notes + ` | Người nhận: ${checkoutForm.fullName}, SĐT: ${checkoutForm.phone}, Địa chỉ: ${checkoutForm.address}`,
              cartItems: cartItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity
              }))
          };

          await orderService.createOrder(orderData);

          // Simulated email success message
          setSuccessMessage(`Đặt hàng thành công! Đơn hàng mới đã được khởi tạo trong Database. Một email thông tin chi tiết hóa đơn đơn hàng đã được gửi tự động tới ${localStorage.getItem('customerEmail') || 'hòm thư của bạn'}.`);
          
          setTimeout(() => {
              onClearCart();
              navigate('/');
          }, 4000);

      } catch (err) {
          setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!');
      } finally {
          setLoading(false);
      }
  };

  if (cartItems.length === 0 && !successMessage) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Giỏ hàng của bạn đang trống. Không thể tiến hành thanh toán.</h4>
        <Link to="/shop" className="btn-login mt-3 d-inline-block text-decoration-none">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <h2 className="fw-bold mb-4" style={{ color: '#111827' }}>
        <i className="fa-solid fa-credit-card text-primary me-2"></i>
        Thông Tin Giao Hàng & Thanh Toán
      </h2>

      {successMessage ? (
        <div className="auth-alert success text-center py-5" style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <i className="fa-solid fa-circle-check" style={{ fontSize: '4rem', color: '#10b981' }}></i>
          <h4 className="fw-bold text-success">Đặt Hàng Thành Công!</h4>
          <p className="fs-5 text-muted px-4" style={{ maxWidth: '600px' }}>{successMessage}</p>
          <small className="text-muted">Đang điều hướng về Trang chủ...</small>
        </div>
      ) : (
        <div className="row g-4">
          {/* Checkout Form */}
          <div className="col-md-7">
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleCheckoutSubmit}>
                {error && <div className="auth-alert error mb-3">{error}</div>}

                <div className="auth-input-group mb-3">
                  <label><i className="fa-solid fa-user me-2 text-muted"></i> Họ và tên người nhận *</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={checkoutForm.fullName}
                    onChange={handleFormChange}
                    placeholder="Nhập tên người nhận"
                    required
                  />
                </div>

                <div className="auth-input-group mb-3">
                  <label><i className="fa-solid fa-phone me-2 text-muted"></i> Số điện thoại nhận hàng *</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={checkoutForm.phone}
                    onChange={handleFormChange}
                    placeholder="Nhập số điện thoại liên hệ"
                    required
                  />
                </div>

                <div className="auth-input-group mb-3">
                  <label><i className="fa-solid fa-location-dot me-2 text-muted"></i> Địa chỉ giao hàng *</label>
                  <input 
                    type="text" 
                    name="address"
                    value={checkoutForm.address}
                    onChange={handleFormChange}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                    required
                  />
                </div>

                <div className="auth-input-group mb-4">
                  <label><i className="fa-solid fa-comment-dots me-2 text-muted"></i> Ghi chú đơn hàng (Tùy chọn)</label>
                  <textarea 
                    style={{ width: '100%', padding: '10px 15px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', outline: 'none' }}
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Giao hàng giờ hành chính..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="auth-submit-btn w-100" 
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)', margin: 0, padding: '12px 0' }}
                  disabled={loading}
                >
                  {loading ? (
                    <><i className="fa-solid fa-spinner fa-spin me-2"></i> Đang xử lý tạo đơn...</>
                  ) : (
                    'Xác Nhận Đặt Hàng'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-5">
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h5 className="fw-bold mb-3" style={{ color: '#1f2937' }}>Tóm tắt đơn hàng</h5>
              
              <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem' }}>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                    <div>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                      <small className="text-muted d-block">Số lượng: {item.quantity}</small>
                    </div>
                    <span className="fw-bold text-slate" style={{ fontSize: '0.9rem' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2" style={{ fontWeight: '600', color: '#4b5563' }}>
                <span>Tạm tính:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3" style={{ fontWeight: '600', color: '#4b5563' }}>
                <span>Vận chuyển:</span>
                <span className="text-success">Miễn phí</span>
              </div>
              
              <hr />

              <div className="d-flex justify-content-between mt-3" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#ef4444' }}>
                <span>Tổng thanh toán:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
