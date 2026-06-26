import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { BACKEND_URL } from '../api/axiosClient';
import { useToast } from '../context/ToastContext';

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return BACKEND_URL + url;
    return BACKEND_URL + '/uploads/' + url;
};

const ProductList = ({ activeId, onSelectProduct, onAddToCart }) => {
    const { showToast } = useToast();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [searchParams] = useSearchParams();
    const urlSearch = searchParams.get('search') || '';
    const navigate = useNavigate();
    
    // Track selected quantities for each product card
    const [quantities, setQuantities] = useState({});

    // Search & Sort State
    const [searchTerm, setSearchTerm] = useState(urlSearch);
    const [sortBy, setSortBy] = useState('default');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [filterTag, setFilterTag] = useState('all');

    useEffect(() => {
        setFilterTag('all');
    }, [activeId]);

    useEffect(() => {
        setSearchTerm(urlSearch);
    }, [urlSearch]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6; // 6 sản phẩm mỗi trang

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Reset trang hiện tại khi thay đổi danh mục, tìm kiếm, sắp xếp hoặc tag lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [activeId, searchTerm, sortBy, minPrice, maxPrice, filterTag]);

    if (loading) {
        return (
            <div className="loading-spinner">
                <i className="fa-solid fa-spinner"></i> Đang tải sản phẩm...
            </div>
        );
    }

    // 1. Lọc sản phẩm theo danh mục và tìm kiếm, đơn giá
    let filtered = activeId 
        ? products.filter(item => item.categoryProductId === activeId) 
        : products;

    // Áp dụng bộ lọc xịn theo tag
    if (filterTag === 'sale') {
        filtered = filtered.filter(item => item.isOnSale);
    } else if (filterTag === 'new') {
        // Sắp xếp ID lớn nhất (mới nhất) lên đầu
        filtered = [...filtered].sort((a, b) => b.id - a.id);
    } else if (filterTag === 'bestseller') {
        // Giả lập sản phẩm bán chạy có tồn kho < 25 (sắp cháy hàng)
        filtered = filtered.filter(item => item.stockQuantity > 0 && item.stockQuantity < 25);
    }

    if (searchTerm.trim() !== '') {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    if (minPrice !== '') {
        filtered = filtered.filter(item => item.price >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
        filtered = filtered.filter(item => item.price <= parseFloat(maxPrice));
    }

    // 2. Sắp xếp sản phẩm
    if (sortBy === 'priceAsc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceDesc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'nameAsc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // 3. Phân trang
    const totalProducts = filtered.length;
    const totalPages = Math.ceil(totalProducts / pageSize);
    const paginatedProducts = filtered.slice(
        (currentPage - 1) * pageSize, 
        currentPage * pageSize
    );

    return (
        <div>
            {/* Quick Filter Tabs */}
            <div className="filter-tabs-container">
                <button 
                    className={`filter-tab-btn ${filterTag === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterTag('all')}
                >
                    <i className="fa-solid fa-border-all"></i> Tất cả
                </button>
                <button 
                    className={`filter-tab-btn ${filterTag === 'sale' ? 'active' : ''}`}
                    onClick={() => setFilterTag('sale')}
                >
                    <i className="fa-solid fa-fire text-danger"></i> Đang Giảm Giá
                </button>
                <button 
                    className={`filter-tab-btn ${filterTag === 'new' ? 'active' : ''}`}
                    onClick={() => setFilterTag('new')}
                >
                    <i className="fa-solid fa-bolt text-warning"></i> Mới Về
                </button>
                <button 
                    className={`filter-tab-btn ${filterTag === 'bestseller' ? 'active' : ''}`}
                    onClick={() => setFilterTag('bestseller')}
                >
                    <i className="fa-solid fa-crown text-primary"></i> Bán Chạy
                </button>
            </div>

            {/* Toolbar: Tìm kiếm và Sắp xếp */}
            <div className="product-toolbar mb-4">
                <div className="row g-3 align-items-center justify-content-between">
                    <div className="col-md-6 col-lg-5">
                        <div className="search-box-wrapper">
                            <i className="fa-solid fa-magnifying-glass search-icon"></i>
                            <input 
                                type="text" 
                                className="form-control search-input" 
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Price Range Filter */}
                    <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                        <input 
                            type="number" 
                            min="0"
                            className="form-control" 
                            style={{ borderRadius: '20px', height: '40px', fontSize: '0.85rem', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                            placeholder="Giá Min (VNĐ)..."
                            value={minPrice}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || parseFloat(val) >= 0) {
                                    setMinPrice(val);
                                }
                            }}
                        />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>tới</span>
                        <input 
                            type="number" 
                            min="0"
                            className="form-control" 
                            style={{ borderRadius: '20px', height: '40px', fontSize: '0.85rem', border: '1px solid rgba(0, 0, 0, 0.12)' }}
                            placeholder="Giá Max (VNĐ)..."
                            value={maxPrice}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || parseFloat(val) >= 0) {
                                    setMaxPrice(val);
                                }
                            }}
                        />
                    </div>
                    <div className="col-md-6 col-lg-4 text-end d-flex align-items-center gap-2 justify-content-end">
                        <label className="sort-label text-nowrap">Sắp xếp:</label>
                        <select 
                            className="form-select sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Mới nhất</option>
                            <option value="priceAsc">Giá: Thấp đến Cao</option>
                            <option value="priceDesc">Giá: Cao đến Thấp</option>
                            <option value="nameAsc">Tên: A - Z</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="row">
                {paginatedProducts.length === 0 ? (
                    <div className="col-12">
                        <div className="no-products-found py-5 text-center">
                            <i className="fa-solid fa-box-open mb-3 display-4 text-muted"></i>
                            <p className="text-muted fs-5">Không tìm thấy sản phẩm phù hợp yêu cầu.</p>
                        </div>
                    </div>
                ) : (
                    paginatedProducts.map((item) => {
                        const isSale = item.isOnSale;
                        const discountPercent = isSale ? Math.round(((item.price - item.salePrice) / item.price) * 100) : 0;
                        return (
                            <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={item.id}>
                                <div className="product-card" onClick={() => onSelectProduct(item)}>
                                    <div className="product-img-wrapper">
                                        <img 
                                            src={getImageUrl(item.imageUrl)} 
                                            alt={item.name} 
                                            className="product-img"
                                        />
                                        {isSale && discountPercent > 0 && (
                                            <span className="product-badge" style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}>-{discountPercent}%</span>
                                        )}
                                        {!isSale && item.stockQuantity <= 5 && item.stockQuantity > 0 && (
                                            <span className="product-badge" style={{ background: '#f59e0b' }}>Sắp hết</span>
                                        )}
                                        {item.stockQuantity === 0 && (
                                            <span className="product-badge" style={{ background: '#6b7280' }}>Hết hàng</span>
                                        )}
                                    </div>
                                    <div className="product-body">
                                        <h5 className="product-name">{item.name}</h5>
                                        <p className="product-price" style={{ margin: '0 0 12px 0' }}>
                                            {isSale && (
                                                <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.85rem', marginRight: '8px', fontWeight: '500' }}>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </span>
                                            )}
                                            <span style={{ color: isSale ? '#ef4444' : 'inherit' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(isSale ? item.salePrice : item.price)}
                                            </span>
                                        </p>
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <p className="product-stock" style={{ margin: 0 }}>
                                                <i className="fa-solid fa-box-open mr-1"></i>
                                                Tồn kho: {item.stockQuantity}
                                            </p>
                                            {item.stockQuantity > 0 && (
                                                <div className="d-flex align-items-center" style={{ gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                                                        style={{ width: '24px', height: '24px', padding: 0 }}
                                                        onClick={() => {
                                                            const currentQty = quantities[item.id] || 1;
                                                            if (currentQty > 1) {
                                                                setQuantities({ ...quantities, [item.id]: currentQty - 1 });
                                                            }
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm text-center" 
                                                        style={{ width: '32px', height: '24px', padding: 0, fontSize: '0.8rem', fontWeight: 'bold' }} 
                                                        value={quantities[item.id] || 1}
                                                        readOnly 
                                                    />
                                                    <button 
                                                        className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" 
                                                        style={{ width: '24px', height: '24px', padding: 0 }}
                                                        onClick={() => {
                                                            const currentQty = quantities[item.id] || 1;
                                                            if (currentQty < item.stockQuantity) {
                                                                setQuantities({ ...quantities, [item.id]: currentQty + 1 });
                                                            } else {
                                                                showToast(`Chỉ còn ${item.stockQuantity} sản phẩm trong kho!`, 'warning');
                                                            }
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-flex gap-2" style={{ marginTop: 'auto' }} onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                className="btn btn-outline-primary btn-sm flex-fill" 
                                                style={{ borderRadius: '8px', height: '36px', fontSize: '0.8rem', fontWeight: 'bold' }}
                                                onClick={() => {
                                                    const qty = quantities[item.id] || 1;
                                                    const success = onAddToCart(item, qty);
                                                    if (success !== false) {
                                                        navigate('/checkout');
                                                    }
                                                }}
                                                disabled={item.stockQuantity === 0}
                                            >
                                                Mua ngay
                                            </button>
                                            <button 
                                                className="btn btn-primary btn-sm flex-fill d-flex align-items-center justify-content-center gap-1" 
                                                style={{ borderRadius: '8px', height: '36px', fontSize: '0.8rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', border: 'none' }}
                                                onClick={() => {
                                                    const qty = quantities[item.id] || 1;
                                                    onAddToCart(item, qty);
                                                }}
                                                disabled={item.stockQuantity === 0}
                                            >
                                                <i className="fa-solid fa-cart-plus"></i>
                                                Thêm giỏ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Điều khiển Phân trang */}
            {totalPages > 1 && (
                <div className="pagination-wrapper mt-4 d-flex justify-content-center">
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-custom">
                            {/* Nút Trước */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                            </li>

                            {/* Các số trang */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <li 
                                        key={pageNumber} 
                                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                                    >
                                        <button 
                                            className="page-link" 
                                            onClick={() => setCurrentPage(pageNumber)}
                                        >
                                            {pageNumber}
                                        </button>
                                    </li>
                                );
                            })}

                            {/* Nút Sau */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default ProductList;
