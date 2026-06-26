import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import orderService from '../services/orderService';
import { useToast } from '../context/ToastContext';

function Checkout({ cartItems, onRemoveItems }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast, confirm } = useToast();
  
  // Use checkoutItems from router state (checked items or "Buy Now" item), fallback to all cart items
  const checkoutItems = location.state?.checkoutItems || cartItems;

  const [notes, setNotes] = useState('');
  const [checkoutForm, setCheckoutForm] = useState({
      fullName: localStorage.getItem('customerName') || '',
      phone: localStorage.getItem('customerPhone') || '',
      address: localStorage.getItem('customerAddress') || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Vietnam open-api provinces states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [useDropdownAddress, setUseDropdownAddress] = useState(false);
  const [selectedProv, setSelectedProv] = useState('');
  const [selectedDist, setSelectedDist] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');

  // Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        if (res.ok) {
          const data = await res.json();
          setProvinces(data);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách tỉnh thành:", err);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch Districts when Province changes
  useEffect(() => {
    if (!selectedProv) {
      setDistricts([]);
      setWards([]);
      setSelectedDist('');
      setSelectedWard('');
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProv}?depth=2`);
        if (res.ok) {
          const data = await res.json();
          setDistricts(data.districts || []);
          setSelectedDist('');
          setWards([]);
          setSelectedWard('');
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách quận huyện:", err);
      }
    };
    fetchDistricts();
  }, [selectedProv]);

  // Fetch Wards when District changes
  useEffect(() => {
    if (!selectedDist) {
      setWards([]);
      setSelectedWard('');
      return;
    }
    const fetchWards = async () => {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${selectedDist}?depth=2`);
        if (res.ok) {
          const data = await res.json();
          setWards(data.wards || []);
          setSelectedWard('');
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách phường xã:", err);
      }
    };
    fetchWards();
  }, [selectedDist]);

  // Sync generated dropdown address with checkoutForm address field
  useEffect(() => {
    if (!useDropdownAddress) return;

    const provObj = provinces.find(p => p.code === parseInt(selectedProv));
    const distObj = districts.find(d => d.code === parseInt(selectedDist));
    const wardObj = wards.find(w => w.code === parseInt(selectedWard));

    const provName = provObj ? provObj.name : '';
    const distName = distObj ? distObj.name : '';
    const wardName = wardObj ? wardObj.name : '';

    const parts = [];
    if (street.trim()) parts.push(street.trim());
    if (wardName) parts.push(wardName);
    if (distName) parts.push(distName);
    if (provName) parts.push(provName);

    const fullAddr = parts.join(', ');
    setCheckoutForm(prev => ({ ...prev, address: fullAddr }));
  }, [selectedProv, selectedDist, selectedWard, street, useDropdownAddress, provinces, districts, wards]);

  const getItemPrice = (item) => {
      return item.isOnSale ? item.salePrice : item.price;
  };

  const totalAmount = checkoutItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  const handleFormChange = (e) => {
      setCheckoutForm({ ...checkoutForm, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');

      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
          showToast('Bạn cần đăng nhập để đặt hàng!', 'warning');
          return;
      }

      if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
          showToast('Vui lòng nhập đầy đủ thông tin giao hàng bắt buộc!', 'warning');
          return;
      }

      const totalAmount = checkoutItems.reduce((sum, item) => {
          const price = item.isOnSale ? item.salePrice : item.price;
          return sum + price * item.quantity;
      }, 0);

      const isConfirmed = await confirm({
          title: 'Xác nhận đặt hàng',
          message: `Bạn có chắc chắn muốn đặt đơn hàng này với tổng trị giá ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}?`
      });

      if (!isConfirmed) return;

      setLoading(true);

      try {
          const orderData = {
              customerId: parseInt(customerId),
              notes: notes + ` | Người nhận: ${checkoutForm.fullName}, SĐT: ${checkoutForm.phone}, Địa chỉ: ${checkoutForm.address}`,
              cartItems: checkoutItems.map(item => ({
                  productId: item.id,
                  quantity: item.quantity
              }))
          };

          await orderService.createOrder(orderData);

          showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
          setSuccessMessage('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
          
          setTimeout(() => {
              // Remove only the items that were checked out
              onRemoveItems(checkoutItems.map(item => item.id));
              navigate('/');
          }, 2000);

      } catch (err) {
          const errMsg = err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!';
          showToast(errMsg, 'error');
          setError(errMsg);
      } finally {
          setLoading(false);
      }
  };

  if (checkoutItems.length === 0 && !successMessage) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Chưa chọn sản phẩm nào để tiến hành thanh toán.</h4>
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
                  {!useDropdownAddress ? (
                      <input 
                        type="text" 
                        name="address"
                        value={checkoutForm.address}
                        onChange={handleFormChange}
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện"
                        required
                      />
                  ) : (
                      <input 
                        type="text" 
                        name="street"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Số nhà, tên đường..."
                        required
                      />
                  )}
                  
                  <div className="form-check mt-2">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="useDropdownAddress" 
                        checked={useDropdownAddress}
                        onChange={(e) => {
                            setUseDropdownAddress(e.target.checked);
                            if (!e.target.checked) {
                                setSelectedProv('');
                                setSelectedDist('');
                                setSelectedWard('');
                                setStreet('');
                                setCheckoutForm(prev => ({ ...prev, address: localStorage.getItem('customerAddress') || '' }));
                            }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <label className="form-check-label small fw-semibold text-muted" htmlFor="useDropdownAddress" style={{ cursor: 'pointer' }}>
                        Chọn địa chỉ từ danh sách Tỉnh/Quận/Xã (Bộ lọc tự động)
                      </label>
                  </div>
                </div>

                {/* Vietnam Provinces Dropdowns Section */}
                {useDropdownAddress && (
                    <div className="bg-light p-3 rounded-4 border mb-3">
                        <div className="row g-2">
                            <div className="col-12 mb-2">
                                <label className="form-label small fw-bold text-slate m-0">Tỉnh / Thành phố *</label>
                                <select 
                                    className="form-select" 
                                    style={{ borderRadius: '10px', fontSize: '0.9rem', width: '100%', padding: '8px' }}
                                    value={selectedProv}
                                    onChange={(e) => setSelectedProv(e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn Tỉnh / Thành phố --</option>
                                    {provinces.map(p => (
                                        <option key={p.code} value={p.code}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mb-2">
                                <label className="form-label small fw-bold text-slate m-0">Quận / Huyện *</label>
                                <select 
                                    className="form-select" 
                                    style={{ borderRadius: '10px', fontSize: '0.9rem', width: '100%', padding: '8px' }}
                                    value={selectedDist}
                                    onChange={(e) => setSelectedDist(e.target.value)}
                                    disabled={!selectedProv}
                                    required
                                >
                                    <option value="">-- Chọn Quận / Huyện --</option>
                                    {districts.map(d => (
                                        <option key={d.code} value={d.code}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-12 mb-2">
                                <label className="form-label small fw-bold text-slate m-0">Phường / Xã *</label>
                                <select 
                                    className="form-select" 
                                    style={{ borderRadius: '10px', fontSize: '0.9rem', width: '100%', padding: '8px' }}
                                    value={selectedWard}
                                    onChange={(e) => setSelectedWard(e.target.value)}
                                    disabled={!selectedDist}
                                    required
                                >
                                    <option value="">-- Chọn Phường / Xã --</option>
                                    {wards.map(w => (
                                        <option key={w.code} value={w.code}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {checkoutForm.address && (
                            <div className="mt-3 text-muted small">
                                <strong>Địa chỉ giao hàng:</strong> <span className="text-dark fw-semibold">{checkoutForm.address}</span>
                            </div>
                        )}
                    </div>
                )}

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
                {checkoutItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                    <div>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{item.name}</span>
                      <small className="text-muted d-block">Số lượng: {item.quantity}</small>
                    </div>
                    <span className="fw-bold text-slate" style={{ fontSize: '0.9rem' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getItemPrice(item) * item.quantity)}
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
