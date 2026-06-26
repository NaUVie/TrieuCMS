import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer-premium">
      <div className="container">
        <div className="row g-4 text-start">
          {/* Column 1: Brand Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="text-white" style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.5px' }}>
              <span className="brand-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #d946ef)', marginRight: '8px' }}></span>
              TRIEU TECHSTORE
            </h5>
            <p className="mt-3" style={{ lineHeight: '1.6', color: '#94a3b8' }}>
              Siêu thị Thiết bị Số & Công nghệ cao cấp hàng đầu Việt Nam. Chúng tôi cam kết cung cấp sản phẩm chính hãng 100%, bảo hành uy tín và dịch vụ chăm sóc khách hàng tận tâm.
            </p>
            <div className="mt-4">
              <a href="https://facebook.com" className="social-icon" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://youtube.com" className="social-icon" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube text-danger"></i></a>
              <a href="https://instagram.com" className="social-icon" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram text-warning"></i></a>
              <a href="https://tiktok.com" className="social-icon" target="_blank" rel="noreferrer"><i className="fa-brands fa-tiktok text-light"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5>Liên Kết Nhanh</h5>
            <ul className="list-unstyled mt-3">
              <li><Link to="/" className="footer-link">Trang chủ</Link></li>
              <li><Link to="/shop" className="footer-link">Cửa hàng</Link></li>
              <li><Link to="/blog" className="footer-link">Tin tức công nghệ</Link></li>
              <li><Link to="/profile" className="footer-link">Tài khoản</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="col-lg-3 col-md-6 col-6">
            <h5>Chính Sách Hỗ Trợ</h5>
            <ul className="list-unstyled mt-3">
              <li><Link to="/support?tab=guides" className="footer-link">Hướng dẫn mua hàng</Link></li>
              <li><Link to="/support?tab=warranty" className="footer-link">Chính sách bảo hành</Link></li>
              <li><Link to="/support?tab=returns" className="footer-link">Đổi trả trong 30 ngày</Link></li>
              <li><Link to="/support?tab=privacy" className="footer-link">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-lg-3 col-md-6">
            <h5>Thông Tin Liên Hệ</h5>
            <div className="mt-3">
              <div className="contact-item">
                <i className="fa-solid fa-location-dot mt-1"></i>
                <span>123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-phone mt-1"></i>
                <span>Hotline: 1900 8198 (8h00 - 22h00)</span>
              </div>
              <div className="contact-item">
                <i className="fa-solid fa-envelope mt-1"></i>
                <span>support@trieutechstore.vn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bottom-bar d-flex flex-wrap justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            &copy; 2026 <strong>Trieu TechStore</strong>. Bảo lưu mọi quyền. Thiết kế bởi <strong>La Quang Triều</strong>.
          </div>
          <div>
            <span className="payment-badge">VISA</span>
            <span className="payment-badge">MASTERCARD</span>
            <span className="payment-badge">MOMO</span>
            <span className="payment-badge">VNPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
