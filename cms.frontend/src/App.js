import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import PostDetail from './pages/PostDetail';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AuthModal from './components/AuthModal';
import categoryProductService from './services/categoryProductService';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [categories, setCategories] = useState([]);

  // Cart state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('techstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('techstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Load user session and navbar categories
  useEffect(() => {
      const savedName = localStorage.getItem('customerName');
      if (savedName) {
          setCustomerName(savedName);
      }

      const fetchNavbarCategories = async () => {
        try {
          const cats = await categoryProductService.getAllCategoryProducts();
          setCategories(cats);
        } catch (error) {
          console.error("Lỗi khi tải danh mục header:", error);
        }
      };
      fetchNavbarCategories();
  }, []);

  const handleAuthSuccess = (name) => {
      setCustomerName(name);
  };

  const handleLogout = () => {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerId');
      localStorage.removeItem('customerName');
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('customerPhone');
      localStorage.removeItem('customerAddress');
      setCustomerName('');
      setCart([]);
  };

  const handleAddToCart = (product) => {
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
          if (existing.quantity >= product.stockQuantity) {
              alert(`Số lượng sản phẩm trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`);
              return;
          }
          setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
          if (product.stockQuantity < 1) {
              alert("Sản phẩm đã hết hàng!");
              return;
          }
          setCart([...cart, { ...product, quantity: 1 }]);
      }
      alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
      if (newQuantity <= 0) {
          handleRemoveItem(productId);
          return;
      }
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemoveItem = (productId) => {
      setCart(cart.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
      setCart([]);
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      {/* ========== HEADER WITH GLASSMORPHIC NAVBAR ========== */}
      <header className="site-header">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="brand-dot"></span>
            TRIEU TECHSTORE
          </Link>
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
            
            {/* Shopping Cart Trigger Icon with Badge Count */}
            <Link 
              className="nav-link-custom border-0 bg-transparent text-decoration-none" 
              to="/cart"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            >
              <i className="fa-solid fa-cart-shopping"></i> Giỏ hàng
              {cartItemsCount > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.7rem', fontWeight: '800', padding: '3px 8px', borderRadius: '10px', marginLeft: '3px', boxShadow: '0 2px 5px rgba(239, 68, 68, 0.4)' }}>
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            {/* Dynamic Customer Session Display */}
            {customerName ? (
                <div className="user-session" style={{ marginLeft: '10px' }}>
                    <span className="user-welcome">
                        <i className="fa-solid fa-user-circle user-avatar-icon"></i>
                        Chào, <strong>{customerName}</strong>
                    </span>
                    <button className="btn-logout" onClick={handleLogout}>
                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                    </button>
                </div>
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
          </nav>
        </div>
      </header>

      {/* ========== MAIN CONTENT ========== */}
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/cart" element={<Cart cartItems={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/checkout" element={<Checkout cartItems={cart} onClearCart={handleClearCart} />} />
        </Routes>
      </main>

      {/* ========== FOOTER ========== */}
      <footer className="site-footer">
        <div className="container">
          &copy; 2026 <strong>Trieu TechStore</strong>. Siêu thị Thiết bị Số & Công nghệ cao cấp.
        </div>
      </footer>

      {/* ========== AUTH MODAL FOR CUSTOMERS ========== */}
      <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={handleAuthSuccess}
      />
    </Router>
  );
}

export default App;
