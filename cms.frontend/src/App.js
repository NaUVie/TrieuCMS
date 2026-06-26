import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import PostDetail from './pages/PostDetail';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Support from './pages/Support';
import AuthModal from './components/AuthModal';
import categoryProductService from './services/categoryProductService';
import './App.css';

import Header from './components/Header';
import Footer from './components/Footer';

import { useToast } from './context/ToastContext';
import AIChatBot from './components/AIChatBot';

function App() {
  const { showToast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [categories, setCategories] = useState([]);
  const [headerSearch, setHeaderSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch('');
    }
  };

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

  const handleAddToCart = (product, quantityToAdd = 1) => {
      const qty = parseInt(quantityToAdd) || 1;
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
          if (existing.quantity + qty > product.stockQuantity) {
              showToast(`Số lượng sản phẩm trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`, 'warning');
              return false;
          }
          setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item));
      } else {
          if (product.stockQuantity < qty) {
              showToast(`Số lượng sản phẩm trong kho không đủ! Chỉ còn ${product.stockQuantity} sản phẩm.`, 'warning');
              return false;
          }
          setCart([...cart, { ...product, quantity: qty }]);
      }
      showToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
      return true;
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

  const handleRemoveItems = (productIds) => {
      setCart(cart.filter(item => !productIds.includes(item.id)));
  };

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Header 
        categories={categories}
        headerSearch={headerSearch}
        setHeaderSearch={setHeaderSearch}
        handleSearchSubmit={handleSearchSubmit}
        customerName={customerName}
        cartItemsCount={cartItemsCount}
        setIsAuthModalOpen={setIsAuthModalOpen}
        handleLogout={handleLogout}
      />

      {/* ========== MAIN CONTENT ========== */}
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem', minHeight: '60vh' }}>
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={handleAddToCart} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/cart" element={<Cart cartItems={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onClearCart={handleClearCart} onOpenAuth={() => setIsAuthModalOpen(true)} />} />
          <Route path="/checkout" element={<Checkout cartItems={cart} onRemoveItems={handleRemoveItems} />} />
          <Route path="/profile" element={<Profile onOpenAuth={() => setIsAuthModalOpen(true)} onProfileUpdate={handleAuthSuccess} onLogout={handleLogout} />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>

      <Footer />

      {/* ========== AUTH MODAL FOR CUSTOMERS ========== */}
      <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={handleAuthSuccess}
      />

      {/* ========== FLOATING AI CHATBOT ASSISTANT ========== */}
      <AIChatBot onAddToCart={handleAddToCart} />
    </>
  );
}

export default App;
