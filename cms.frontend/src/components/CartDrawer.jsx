import React, { useState } from 'react';
import orderService from '../services/orderService';
import { BACKEND_URL } from '../api/axiosClient';

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';
    if (url.startsWith('/')) return BACKEND_URL + url;
    return url;
};

const CartDrawer = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, onOpenAuth }) => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [notes, setNotes] = useState('');
    const [checkoutForm, setCheckoutForm] = useState({
        fullName: localStorage.getItem('customerName') || '',
        phone: localStorage.getItem('customerPhone') || '',
        address: localStorage.getItem('customerAddress') || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    if (!isOpen) return null;

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
            onOpenAuth();
            return;
        }

        if (!checkoutForm.fullName || !checkoutForm.phone || !checkoutForm.address) {
            setError('Vui lòng nhập đầy đủ thông tin giao hàng (Họ tên, Số điện thoại, Địa chỉ)!');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                customerId: parseInt(customerId),
                notes: notes + ` | Giao tới: ${checkoutForm.fullName}, SĐT: ${checkoutForm.phone}, ĐC: ${checkoutForm.address}`,
                cartItems: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            await orderService.createOrder(orderData);

            // Simulation of Email sent
            setSuccessMessage(`Đặt hàng thành công! Đơn hàng mới đã được khởi tạo trong Database. Một email thông tin chi tiết đơn hàng đã được gửi tới ${localStorage.getItem('customerEmail') || 'email của bạn'}.`);
            
            setTimeout(() => {
                onClearCart();
                setIsCheckingOut(false);
                setNotes('');
                onClose();
            }, 3500);

        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra trong quá trình đặt hàng. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', alignItems: 'stretch' }}>
            <div className="auth-modal-card" onClick={(e) => e.stopPropagation()} style={{ width: '500px', maxWidth: '100%', height: '100vh', borderRadius: 0, padding: '2rem', display: 'flex', flexDirection: 'column', animation: 'slideLeft 0.3s ease-out' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0, 0, 0, 0.08)', paddingBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontWeight: '800', color: '#111827' }}>
                        <i className="fa-solid fa-cart-shopping" style={{ color: '#4f46e5', marginRight: '10px' }}></i>
                        Giỏ Hàng Của Bạn
                    </h3>
                    <button className="auth-close-btn" style={{ position: 'static' }} onClick={onClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {successMessage ? (
                    <div className="auth-alert success" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '15px' }}>
                        <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: '#10b981' }}></i>
                        <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{successMessage}</p>
                    </div>
                ) : (
                    <>
                        {/* Cart Items Area */}
                        {!isCheckingOut ? (
                            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                                {cartItems.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '3rem 0', color: '#9ca3af' }}>
                                        <i className="fa-solid fa-basket-shopping" style={{ fontSize: '4rem', marginBottom: '1rem' }}></i>
                                        <p style={{ fontWeight: '500' }}>Giỏ hàng của bạn đang trống.</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div key={item.id} style={{ display: 'flex', gap: '15px', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)', alignItems: 'center' }}>
                                            <img 
                                                src={getImageUrl(item.imageUrl)} 
                                                alt={item.name} 
                                                style={{ width: '70px', height: '70px', objectFit: 'contain', background: '#f9fafb', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h6 style={{ margin: '0 0 5px 0', fontWeight: '700', fontSize: '0.95rem', color: '#1f2937' }}>{item.name}</h6>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: '800', color: '#ef4444', fontSize: '0.9rem' }}>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </span>
                                                    
                                                    {/* Quantity Control */}
                                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '15px', overflow: 'hidden' }}>
                                                        <button 
                                                            style={{ background: 'none', border: 'none', padding: '3px 10px', cursor: 'pointer', fontWeight: '700' }}
                                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: '700' }}>{item.quantity}</span>
                                                        <button 
                                                            style={{ background: 'none', border: 'none', padding: '3px 10px', cursor: 'pointer', fontWeight: '700' }}
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
                                                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem' }}
                                                onClick={() => onRemoveItem(item.id)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Checkout Form Area */
                            <form onSubmit={handleCheckoutSubmit} style={{ flex: 1, overflowY: 'auto', marginBottom: '1.5rem' }}>
                                <h5 style={{ fontWeight: '700', marginBottom: '1.2rem', color: '#374151' }}>Thông Tin Thanh Toán</h5>
                                
                                {error && <div className="auth-alert error" style={{ marginBottom: '1rem' }}>{error}</div>}

                                <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
                                    <label><i className="fa-solid fa-user mr-1"></i> Họ và tên người nhận *</label>
                                    <input 
                                        type="text" 
                                        name="fullName"
                                        placeholder="Nhập tên người nhận"
                                        value={checkoutForm.fullName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
                                    <label><i className="fa-solid fa-phone mr-1"></i> Số điện thoại liên hệ *</label>
                                    <input 
                                        type="text" 
                                        name="phone"
                                        placeholder="Nhập số điện thoại giao hàng"
                                        value={checkoutForm.phone}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
                                    <label><i className="fa-solid fa-location-dot mr-1"></i> Địa chỉ giao hàng *</label>
                                    <input 
                                        type="text" 
                                        name="address"
                                        placeholder="Số nhà, tên đường, quận/huyện, tỉnh/TP"
                                        value={checkoutForm.address}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>

                                <div className="auth-input-group" style={{ marginBottom: '1rem' }}>
                                    <label><i className="fa-solid fa-comment-dots mr-1"></i> Ghi chú đơn hàng</label>
                                    <textarea 
                                        style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.12)', fontSize: '0.9rem', outline: 'none' }}
                                        rows="3"
                                        placeholder="Ghi chú về thời gian giao hàng, yêu cầu đặc biệt..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>
                            </form>
                        )}

                        {/* Footer Totals & Action */}
                        {cartItems.length > 0 && (
                            <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: '700', fontSize: '1.1rem' }}>
                                    <span>Tổng cộng:</span>
                                    <span style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: '800' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                    </span>
                                </div>

                                {!isCheckingOut ? (
                                    <button 
                                        className="auth-submit-btn" 
                                        style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)' }}
                                        onClick={() => {
                                            if (!localStorage.getItem('customerId')) {
                                                alert('Vui lòng đăng nhập trước khi tiến hành thanh toán!');
                                                onOpenAuth();
                                                return;
                                            }
                                            setIsCheckingOut(true);
                                        }}
                                    >
                                        Tiến Hành Thanh Toán
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            type="button"
                                            className="btn-login"
                                            style={{ flex: 1, padding: '12px', borderRadius: '12px' }}
                                            onClick={() => setIsCheckingOut(false)}
                                        >
                                            Quay lại giỏ
                                        </button>
                                        <button 
                                            type="button"
                                            className="auth-submit-btn"
                                            style={{ flex: 2, margin: 0 }}
                                            disabled={loading}
                                            onClick={handleCheckoutSubmit}
                                        >
                                            {loading ? (
                                                <><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang xử lý...</>
                                            ) : (
                                                'Xác nhận đặt hàng'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
