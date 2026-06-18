import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService';
import advertisementService from '../services/advertisementService';
import { BACKEND_URL } from '../api/axiosClient';

function Home({ onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [bannerSlides, setBannerSlides] = useState([
    {
      badge: "🔥 SIÊU SALE CÔNG NGHỆ",
      title: "Bộ Sưu Tập Thiết Bị Số 2026",
      desc: "Trải nghiệm các dòng sản phẩm Điện thoại, Laptop, Phụ kiện, Smart TV và Đồng hồ thông minh chính hãng mới nhất. Hỗ trợ trả góp 0%.",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop"
    }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const cats = await categoryProductService.getAllCategoryProducts();
        setCategories(cats);

        const latest = await productService.getLatestProducts();
        setLatestProducts(latest.slice(0, 3));

        const sales = await productService.getSaleProducts();
        setSaleProducts(sales.slice(0, 3));

        const blogs = await blogService.getAllPosts();
        setPosts(blogs.slice(0, 3));

        const ads = await advertisementService.getActiveBanners();
        if (ads && ads.length > 0) {
          const mapped = ads.map((ad, idx) => ({
            badge: idx === 0 ? "🔥 KHUYẾN MÃI HOT" : idx === 1 ? "⚡ DEAL ĐỘC QUYỀN" : "🆕 BẢN TIN KHUYẾN MÃI",
            title: ad.title,
            desc: ad.subTitle || "Sản phẩm công nghệ cao cấp tại Trieu TechStore.",
            imageUrl: ad.imageUrl?.startsWith('/') ? BACKEND_URL + ad.imageUrl : ad.imageUrl,
            linkUrl: ad.linkUrl || "/shop"
          }));
          setBannerSlides(mapped);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu trang chủ:", error);
      }
    };
    fetchHomeData();
  }, []);

  // Slide auto rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerSlides.length]);

  return (
    <div className="home-container">
      {/* Hero Banner with Slideshow */}
      <div 
        className="hero-banner" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.85)), url(${bannerSlides[currentSlide].imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff', 
          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
          padding: '6rem 4rem',
          borderRadius: '28px',
          marginBottom: '3rem',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          overflow: 'hidden'
        }}
      >
        <div className="hero-shapes" style={{ opacity: 0.15 }}>
           <div className="shape shape-1" style={{ background: '#4f46e5', width: '350px', height: '350px', right: '-50px', top: '-50px' }}></div>
           <div className="shape shape-2" style={{ background: '#db2777', width: '400px', height: '400px', left: '-100px', bottom: '-100px' }}></div>
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="hero-badge" style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)', color: '#ffffff', border: 'none', padding: '8px 20px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '1.5rem' }}>
            {bannerSlides[currentSlide].badge}
          </span>
          <h1 style={{ color: '#ffffff', textShadow: '0 4px 12px rgba(0,0,0,0.5)', fontWeight: '800', fontSize: '3.2rem', lineHeight: '1.2', marginBottom: '1.25rem', maxWidth: '800px' }}>{bannerSlides[currentSlide].title}</h1>
          <p style={{ color: '#f3f4f6', opacity: 0.9, textShadow: '0 2px 6px rgba(0,0,0,0.4)', maxWidth: '680px', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>{bannerSlides[currentSlide].desc}</p>
          <Link to={bannerSlides[currentSlide].linkUrl || "/shop"} className="hero-cta" style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)', padding: '14px 32px', borderRadius: '30px', fontWeight: '700', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)', transition: 'all 0.3s' }}>
            Khám phá ngay <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        {/* Dots Indicator */}
        <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
          {bannerSlides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              style={{ width: idx === currentSlide ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: idx === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          ))}
        </div>

        {/* Left Arrow Nav Button */}
        {bannerSlides.length > 1 && (
          <button 
            onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev === 0 ? bannerSlides.length - 1 : prev - 1)); }}
            style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.25)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, transition: 'all 0.3s' }}
            className="banner-nav-arrow"
          >
            <i className="fa-solid fa-chevron-left" style={{ fontSize: '1.2rem' }}></i>
          </button>
        )}

        {/* Right Arrow Nav Button */}
        {bannerSlides.length > 1 && (
          <button 
            onClick={(e) => { e.preventDefault(); setCurrentSlide(prev => (prev + 1) % bannerSlides.length); }}
            style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.25)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 3, transition: 'all 0.3s' }}
            className="banner-nav-arrow"
          >
            <i className="fa-solid fa-chevron-right" style={{ fontSize: '1.2rem' }}></i>
          </button>
        )}
      </div>

      {/* Feature Highlights Section */}
      <div className="row g-4 mb-5 text-center text-md-start">
        <div className="col-md-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79, 70, 229, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-truck-fast" style={{ color: '#4f46e5', fontSize: '1.3rem' }}></i>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', margin: '0 0 4px 0', color: '#111827', fontSize: '0.95rem' }}>Miễn phí giao hàng</h6>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Cho hóa đơn từ 1.000.000đ</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-rotate-left" style={{ color: '#10b981', fontSize: '1.3rem' }}></i>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', margin: '0 0 4px 0', color: '#111827', fontSize: '0.95rem' }}>Đổi trả dễ dàng</h6>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Trong vòng 7 ngày đầu tiên</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#f59e0b', fontSize: '1.3rem' }}></i>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', margin: '0 0 4px 0', color: '#111827', fontSize: '0.95rem' }}>100% Chính hãng</h6>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Cam kết bảo hành chu đáo</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-headset" style={{ color: '#ef4444', fontSize: '1.3rem' }}></i>
            </div>
            <div>
              <h6 style={{ fontWeight: '700', margin: '0 0 4px 0', color: '#111827', fontSize: '0.95rem' }}>Hỗ trợ 24/7</h6>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>Hotline: 1900 1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Grid (Circle) */}
      <div className="mb-5">
        <div className="section-heading">
          <h4><i className="fa-solid fa-circle-nodes text-primary me-2"></i>Khám Phá Ngành Hàng</h4>
        </div>
        <div className="row g-3 justify-content-center">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="col-6 col-md-3 col-lg-2 d-flex">
              <Link to={`/shop?category=${cat.id}`} style={{ width: '100%', display: 'flex' }}>
                <button 
                  style={{ 
                    width: '100%', 
                    minHeight: '190px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem 1rem', 
                    background: '#fff', 
                    border: '1px solid rgba(0,0,0,0.04)', 
                    borderRadius: '20px', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s', 
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)' 
                  }}
                  className="cat-card-hover"
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', transition: 'all 0.3s', flexShrink: 0 }} className="cat-icon-wrapper">
                    <i className={`fa-solid ${idx % 5 === 0 ? 'fa-mobile-screen-button' : idx % 5 === 1 ? 'fa-laptop' : idx % 5 === 2 ? 'fa-headphones' : idx % 5 === 3 ? 'fa-clock' : 'fa-tv'}`} style={{ color: '#4f46e5', fontSize: '1.6rem' }}></i>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937', textAlign: 'center', lineHeight: '1.3' }}>{cat.name}</span>
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Sale Section */}
      {saleProducts.length > 0 && (
        <div className="mb-5">
          <div className="section-heading">
            <h4><i className="fa-solid fa-bolt text-danger me-2"></i>⚡ Giá Sốc Độc Quyền</h4>
          </div>
          <div className="row g-4">
            {saleProducts.map(product => (
              <div key={product.id} className="col-md-4">
                <div className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <div className="product-img-wrapper" style={{ padding: '20px' }}>
                      <span className="product-badge">-15%</span>
                      <img src={product.imageUrl?.startsWith('/') ? BACKEND_URL + product.imageUrl : product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop'} alt={product.name} className="product-img" style={{ maxHeight: '180px' }} />
                    </div>
                  </Link>
                  <div className="product-body">
                    <h5 className="product-name"><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                    <p className="product-price" style={{ margin: '0 0 12px 0' }}>
                      <span style={{ textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.9rem', marginRight: '10px', fontWeight: '500' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 1.15)}
                      </span>
                      <span style={{ color: '#ef4444', fontWeight: '800' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </span>
                    </p>
                    <button className="btn-add-cart" onClick={() => onAddToCart(product)} style={{ marginTop: 'auto' }}>
                      <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Products Section */}
      {latestProducts.length > 0 && (
        <div className="mb-5">
          <div className="section-heading">
            <h4><i className="fa-solid fa-fire text-warning me-2"></i>🔥 Hàng Mới Về Cực Hot</h4>
          </div>
          <div className="row g-4">
            {latestProducts.map(product => (
              <div key={product.id} className="col-md-4">
                <div className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <div className="product-img-wrapper" style={{ padding: '20px' }}>
                      <span className="product-badge" style={{ background: '#10b981' }}>New</span>
                      <img src={product.imageUrl?.startsWith('/') ? BACKEND_URL + product.imageUrl : product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop'} alt={product.name} className="product-img" style={{ maxHeight: '180px' }} />
                    </div>
                  </Link>
                  <div className="product-body">
                    <h5 className="product-name"><Link to={`/product/${product.id}`}>{product.name}</Link></h5>
                    <p className="product-price" style={{ margin: '0 0 12px 0', color: '#4f46e5' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                    <button className="btn-add-cart" onClick={() => onAddToCart(product)} style={{ marginTop: 'auto' }}>
                      <i className="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* News Blog Grid Section */}
      <div id="blog" className="mb-5">
        <div className="section-heading">
          <h4><i className="fa-solid fa-newspaper text-info me-2"></i>Đánh giá & Xu hướng công nghệ</h4>
          <Link to="/blog" className="view-all-btn">Tất cả bài viết <i className="fa-solid fa-arrow-right"></i></Link>
        </div>
        <div className="row g-4">
          {posts.map(post => (
            <div key={post.id} className="col-md-4">
              <Link to={`/post/${post.id}`}>
                <div className="blog-card" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden', height: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                  <img src={post.imageUrl?.startsWith('/') ? BACKEND_URL + post.imageUrl : post.imageUrl} alt={post.title} className="blog-card-img" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                  <div className="blog-card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span className="blog-card-category" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '8px' }}>{post.categoryName || 'Tin tức'}</span>
                    <h5 className="blog-card-title" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1f2937', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>{post.title}</h5>
                    <p className="blog-card-excerpt" style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>{post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : 'Đang cập nhật...'}</p>
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="small text-muted" style={{ fontSize: '0.75rem' }}><i className="fa-regular fa-calendar-days me-1"></i> {new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                      <span className="blog-card-link" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '4px' }}>Đọc tiếp <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i></span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
