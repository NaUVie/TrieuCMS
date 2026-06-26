import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import { BACKEND_URL } from '../api/axiosClient';

const Header = ({ 
  categories, 
  headerSearch, 
  setHeaderSearch, 
  handleSearchSubmit, 
  customerName, 
  cartItemsCount, 
  setIsAuthModalOpen, 
  handleLogout 
}) => {
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all products once for quick autocomplete filtering
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await productService.getAllProducts();
        setAllProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải gợi ý tìm kiếm:", err);
      }
    };
    fetchAll();
  }, []);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setHeaderSearch(val);
    if (val.trim().length > 0) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const getProductImage = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BACKEND_URL + '/uploads/' + url;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="site-header">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="brand-dot"></span>
          NaUCMS.TechGear
        </Link>

        {/* Header Search Bar with Live Autocomplete Suggestions */}
        <div className="header-search-wrapper" style={{ flex: '1', maxWidth: '320px', margin: '0 1.5rem', position: 'relative' }}>
          <form onSubmit={onSubmit} style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm sản phẩm..."
              value={headerSearch}
              onChange={handleInputChange}
              onFocus={() => {
                if (headerSearch.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              style={{
                borderRadius: '20px',
                paddingLeft: '35px',
                fontSize: '0.85rem',
                height: '36px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                outline: 'none',
                background: '#f9fafb'
              }}
            />
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.85rem' }}></i>
          </form>

          {/* Autocomplete Suggestion Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="search-suggestions-dropdown" style={{ position: 'absolute', top: '110%', left: 0, width: '100%', background: '#fff', zIndex: 1000, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid #f3f4f6' }}>
              {suggestions.map(p => {
                const isSale = p.isOnSale;
                const displayPrice = isSale ? p.salePrice : p.price;
                return (
                  <Link 
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => {
                      setShowSuggestions(false);
                      setHeaderSearch('');
                    }}
                    className="suggestion-item"
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
                  >
                    <img 
                      src={getProductImage(p.imageUrl)} 
                      alt={p.name} 
                      style={{ width: '36px', height: '36px', objectFit: 'contain', background: '#f9fafb', borderRadius: '8px' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: isSale ? '#ef4444' : '#6b7280', fontWeight: '700' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(displayPrice)}
                        {isSale && (
                          <span style={{ fontSize: '0.7rem', textDecoration: 'line-through', color: '#9ca3af', marginLeft: '6px', fontWeight: '400' }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
              <div style={{ padding: '6px 12px', background: '#f9fafb', textAlign: 'center' }}>
                <Link 
                  to={`/shop?search=${encodeURIComponent(headerSearch.trim())}`}
                  onClick={() => setShowSuggestions(false)}
                  className="btn btn-link btn-sm text-decoration-none p-0" 
                  style={{ fontSize: '0.725rem', fontWeight: '600', color: '#4f46e5' }}
                >
                  Xem tất cả kết quả cho "{headerSearch}"
                </Link>
              </div>
            </div>
          )}
        </div>

        <nav className="d-flex align-items-center">
          <Link to="/" className="nav-link-custom">Trang chủ</Link>
          <Link to="/shop" className="nav-link-custom">Cửa hàng</Link>
          <Link to="/blog" className="nav-link-custom">Tin tức</Link>
          
          {/* Category Dropdown Menu in Navbar */}
          <div className="dropdown" style={{ marginRight: '5px' }}>
            <button className="nav-link-custom dropdown-toggle border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Ngành hàng
            </button>
            <ul className="dropdown-menu border-0 shadow-lg" style={{ borderRadius: '15px', padding: '10px' }}>
              <li><Link className="dropdown-item" style={{ borderRadius: '8px' }} to="/shop">Tất cả</Link></li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <Link className="dropdown-item" style={{ borderRadius: '8px' }} to={`/shop?category=${cat.id}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Dynamic Customer Session Display */}
          {customerName ? (
              <Link to="/profile" className="nav-link-custom text-decoration-none" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginLeft: '10px' }}>
                  <i className="fa-solid fa-circle-user" style={{ fontSize: '1.15rem' }}></i> Hồ sơ
              </Link>
          ) : (
              <div className="auth-buttons" style={{ marginLeft: '10px' }}>
                  <button className="btn-login" onClick={() => setIsAuthModalOpen(true)}>
                      <i className="fa-solid fa-lock-open mr-1"></i> Đăng Nhập
                  </button>
                  <button className="btn-register" onClick={() => setIsAuthModalOpen(true)}>
                      Đăng Ký
                  </button>
              </div>
          )}

          {/* Shopping Cart Trigger Icon with Badge Count, placed right next to Profile/Login */}
          <Link 
            className="nav-link-custom border-0 bg-transparent text-decoration-none" 
            to="/cart"
            style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: '15px' }}
            title="Giỏ hàng"
          >
            <i className="fa-solid fa-cart-shopping" style={{ fontSize: '1.15rem' }}></i>
            {cartItemsCount > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)' }}>
                {cartItemsCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
