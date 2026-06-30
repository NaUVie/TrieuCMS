import React from 'react';
import { BACKEND_URL } from '../api/axiosClient';

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return BACKEND_URL + url;
    return BACKEND_URL + '/uploads/' + url;
};

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
    if (!isOpen || !product) return null;

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="detail-close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="detail-grid">
                    {/* Image Area */}
                    <div className="detail-img-wrapper">
                        <img 
                            src={getImageUrl(product.imageUrl)} 
                            alt={product.name} 
                            className="detail-img"
                        />
                    </div>

                    {/* Product Specifications & Details */}
                    <div className="detail-info">
                        <h2 className="detail-title">{product.name}</h2>
                        
                        <div className="detail-price-wrapper mb-3">
                            {product.isOnSale ? (
                                <>
                                    <span className="detail-price text-danger me-2" style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.salePrice)}
                                    </span>
                                    <span className="text-decoration-line-through text-muted small" style={{ fontSize: '1.05rem' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </span>
                                </>
                            ) : (
                                <span className="detail-price" style={{ fontSize: '1.6rem', fontWeight: '800' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                </span>
                            )}
                        </div>

                        <div className="detail-description-title">Mô Tả Sản Phẩm</div>
                        <p className="detail-description">
                            {product.description || 'Sản phẩm công nghệ cao cấp chính hãng. Cung cấp hiệu năng vượt trội, thiết kế sang trọng và trải nghiệm tối ưu cho người sử dụng.'}
                        </p>

                        <div className="detail-meta">
                            <div className="detail-meta-item">
                                <i className="fa-solid fa-circle-check"></i>
                                <span>Trạng thái: <strong>{product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}</strong></span>
                            </div>
                            <div className="detail-meta-item">
                                <i className="fa-solid fa-box"></i>
                                <span>Tồn kho: <strong>{product.stockQuantity} sản phẩm</strong></span>
                            </div>
                            <div className="detail-meta-item">
                                <i className="fa-solid fa-shield-halved"></i>
                                <span>Bảo hành: <strong>12 tháng chính hãng</strong></span>
                            </div>
                            <div className="detail-meta-item">
                                <i className="fa-solid fa-truck-fast"></i>
                                <span>Giao hàng: <strong>Miễn phí toàn quốc</strong></span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="detail-actions">
                            <button 
                                className="btn-detail-cart"
                                onClick={() => {
                                    onAddToCart(product);
                                    onClose();
                                }}
                            >
                                <i className="fa-solid fa-cart-plus"></i> Thêm Vào Giỏ Hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
