import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import orderService from '../services/orderService';
import { BACKEND_URL } from '../api/axiosClient';

const MyOrders = () => {
    const navigate = useNavigate();
    const customerId = localStorage.getItem('customerId');
    const isLoggedIn = !!customerId;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderService.getCustomerOrders(customerId);
                setOrders(data);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId, isLoggedIn, navigate]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 0:
                return <span className="badge bg-secondary"><i className="fa-solid fa-receipt me-1"></i> Đã tiếp nhận</span>;
            case 1:
                return <span className="badge bg-warning text-dark"><i className="fa-solid fa-box-open me-1"></i> Đang đóng gói</span>;
            case 2:
                return <span className="badge bg-primary"><i className="fa-solid fa-truck-fast me-1"></i> Đang vận chuyển</span>;
            case 3:
                return <span className="badge bg-success"><i className="fa-solid fa-circle-check me-1"></i> Đã hoàn thành</span>;
            case 4:
            default:
                return <span className="badge bg-danger"><i className="fa-solid fa-circle-xmark me-1"></i> Đã hủy</span>;
        }
    };

    const getOrderTotal = (order) => {
        return order.orderDetails?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
    };

    const getImageUrl = (url) => {
        if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        if (url.startsWith('/')) return BACKEND_URL + url;
        return BACKEND_URL + '/uploads/' + url;
    };

    if (loading) {
        return (
            <div className="loading-spinner" style={{ minHeight: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '15px' }}>
                <i className="fa-solid fa-spinner fa-spin fa-2x text-primary"></i>
                <span className="text-muted fw-semibold">Đang tải lịch sử đơn hàng...</span>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '850px', margin: '2rem auto' }}>
            <div className="card border-0 shadow-lg" style={{ borderRadius: '24px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}>
                <div className="card-header border-0 bg-transparent pt-4 px-4 pb-0 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h3 className="fw-bold" style={{ color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                            <i className="fa-solid fa-clipboard-list" style={{ color: '#4f46e5' }}></i>
                            Đơn Hàng Của Tôi
                        </h3>
                        <p className="text-muted mb-0 mt-1">Theo dõi danh sách đơn hàng và trạng thái xử lý vận chuyển.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/profile')} 
                        className="btn btn-outline-primary d-flex align-items-center gap-2"
                        style={{ borderRadius: '12px', padding: '8px 16px', fontWeight: '600' }}
                    >
                        <i className="fa-solid fa-arrow-left"></i> Quay lại trang cá nhân
                    </button>
                </div>
                <div className="card-body p-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-4 my-3" style={{ border: '1px dashed rgba(0,0,0,0.1)' }}>
                            <i className="fa-solid fa-box-open fa-3x text-muted mb-3" style={{ opacity: '0.6' }}></i>
                            <p className="text-muted fw-bold">Bạn chưa đặt đơn hàng nào trên hệ thống.</p>
                            <Link to="/shop" className="btn btn-primary mt-2" style={{ borderRadius: '12px', padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #db2777)', border: 'none' }}>
                                Đi tới cửa hàng mua sắm
                            </Link>
                        </div>
                    ) : (
                        <div className="orders-list mt-3">
                            {orders.map((order) => {
                                const isExpanded = expandedOrder === order.id;
                                const orderTotal = getOrderTotal(order);
                                return (
                                    <div 
                                        key={order.id} 
                                        className="card mb-3 border shadow-sm" 
                                        style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}
                                    >
                                        <div 
                                            className="card-header bg-white p-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
                                            style={{ cursor: 'pointer', borderBottom: isExpanded ? '1px solid #f1f5f9' : 'none' }}
                                            onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        >
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>
                                                    #{order.id}
                                                </span>
                                                <span className="text-muted small">
                                                    <i className="fa-regular fa-calendar-days me-1"></i>
                                                    {new Date(order.orderDate).toLocaleDateString('vi-VN', {
                                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            
                                            <div className="d-flex align-items-center gap-3 flex-wrap">
                                                {getStatusBadge(order.status)}
                                                <span className="fw-bold text-danger" style={{ minWidth: '110px', textAlign: 'right' }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderTotal)}
                                                </span>
                                                <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-muted`}></i>
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="card-body bg-light p-3">
                                                {order.notes && (
                                                    <div className="alert alert-light border p-2 mb-3 small text-muted" style={{ borderRadius: '8px', background: '#fff' }}>
                                                        <strong className="text-dark">Ghi chú giao hàng:</strong> {order.notes}
                                                    </div>
                                                )}
                                                <div className="table-responsive">
                                                    <table className="table bg-white table-bordered align-middle mb-0" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Sản phẩm</th>
                                                                <th style={{ width: '90px', textAlign: 'center' }}>SL</th>
                                                                <th style={{ width: '130px', textAlign: 'right' }}>Đơn giá</th>
                                                                <th style={{ width: '150px', textAlign: 'right' }}>Thành tiền</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {order.orderDetails?.map((detail) => (
                                                                <tr key={detail.id}>
                                                                    <td>
                                                                        <div className="d-flex align-items-center gap-2">
                                                                            <img 
                                                                                src={getImageUrl(detail.productImageUrl)} 
                                                                                alt={detail.productName} 
                                                                                style={{ width: '48px', height: '48px', objectFit: 'contain', background: '#f9fafb', borderRadius: '8px' }}
                                                                            />
                                                                            <span className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{detail.productName}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="text-center fw-bold">{detail.quantity}</td>
                                                                    <td className="text-end" style={{ fontSize: '0.9rem' }}>
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unitPrice)}
                                                                    </td>
                                                                    <td className="text-end fw-bold text-danger" style={{ fontSize: '0.9rem' }}>
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.totalPrice)}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
