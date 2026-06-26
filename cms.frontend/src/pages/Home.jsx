import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogService';
import productService from '../services/productService';
import categoryProductService from '../services/categoryProductService';
import advertisementService from '../services/advertisementService';
import { BACKEND_URL } from '../api/axiosClient';
import HeroBanner from '../components/HeroBanner';
import CategoryMenu from '../components/CategoryMenu';
import ProductGrid from '../components/ProductGrid';
import BlogSection from '../components/BlogSection';

function Home({ onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();
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
        setLatestProducts(latest.slice(0, 10));

        const sales = await productService.getSaleProducts();
        setSaleProducts(sales.slice(0, 10));

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
      <HeroBanner bannerSlides={bannerSlides} currentSlide={currentSlide} />
      
      <CategoryMenu categories={categories} BACKEND_URL={BACKEND_URL} />

      <ProductGrid 
        title="Giá Sốc Độc Quyền"
        iconClass="fa-solid fa-bolt text-danger"
        products={saleProducts}
        quantities={quantities}
        setQuantities={setQuantities}
        onAddToCart={onAddToCart}
        BACKEND_URL={BACKEND_URL}
        navigate={navigate}
      />

      <ProductGrid 
        title="Hàng Mới Về Cực Hot"
        iconClass="fa-solid fa-fire text-warning"
        products={latestProducts}
        quantities={quantities}
        setQuantities={setQuantities}
        onAddToCart={onAddToCart}
        BACKEND_URL={BACKEND_URL}
        navigate={navigate}
      />

      <BlogSection posts={posts} BACKEND_URL={BACKEND_URL} />
    </div>
  );
}

export default Home;
