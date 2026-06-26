import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <header className="site-header">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="brand-dot"></span>
          TRIEU TECHSTORE
        </Link>

        {/* Header Search Bar */}
        <div className="header-search-wrapper" style={{ flex: '1', maxWidth: '320px', margin: '0 1.5rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Tìm sản phẩm..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
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
