import React from 'react';
import { Link } from 'react-router-dom';

const getCategoryIcon = (name) => {
  const normalized = name ? name.toLowerCase() : '';
  if (normalized.includes('điện thoại') || normalized.includes('máy tính bảng') || normalized.includes('tablet')) {
    return 'fa-solid fa-mobile-screen-button';
  }
  if (normalized.includes('laptop') || normalized.includes('máy tính') || normalized.includes('văn phòng')) {
    return 'fa-solid fa-laptop';
  }
  if (normalized.includes('phụ kiện') || normalized.includes('gear') || normalized.includes('bàn phím') || normalized.includes('chuột')) {
    return 'fa-solid fa-keyboard';
  }
  if (normalized.includes('đồng hồ') || normalized.includes('smartwatch')) {
    return 'fa-solid fa-clock';
  }
  if (normalized.includes('màn hình') || normalized.includes('tv')) {
    return 'fa-solid fa-tv';
  }
  if (normalized.includes('tay cầm') || normalized.includes('gamepad') || normalized.includes('chơi game')) {
    return 'fa-solid fa-gamepad';
  }
  return 'fa-solid fa-microchip';
};

const CategoryMenu = ({ categories }) => {
  return (
    <section className="categories-section" style={{ marginBottom: '4rem' }}>
      <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
        <span className="section-subtitle" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Danh Mục Ngành Hàng</span>
        <h2 className="section-title" style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#1f2937' }}>Tìm Kiếm Theo Nhu Cầu</h2>
        <div className="section-divider" style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #6366f1, #d946ef)', margin: '1rem auto 0 auto', borderRadius: '2px' }}></div>
      </div>
      <div className="d-flex justify-content-center flex-wrap gap-4">
        {categories.map((cat) => {
          const iconClass = getCategoryIcon(cat.name);
          return (
            <Link 
              key={cat.id} 
              to={`/shop?category=${cat.id}`} 
              className="category-card-circle text-decoration-none text-center"
              style={{ width: '130px' }}
            >
              <div className="category-circle-icon-wrapper">
                <i className={iconClass}></i>
              </div>
              <span 
                className="category-card-name"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: '#4b5563',
                  transition: 'color 0.3s'
                }}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryMenu;
