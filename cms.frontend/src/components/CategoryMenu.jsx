import React from 'react';
import { Link } from 'react-router-dom';

const CategoryMenu = ({ categories, BACKEND_URL }) => {
  return (
    <section className="categories-section" style={{ marginBottom: '4rem' }}>
      <div className="section-header text-center" style={{ marginBottom: '2.5rem' }}>
        <span className="section-subtitle" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>Danh Mục Ngành Hàng</span>
        <h2 className="section-title" style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '0.5rem', color: '#1f2937' }}>Tìm Kiếm Theo Nhu Cầu</h2>
        <div className="section-divider" style={{ width: '60px', height: '4px', background: 'linear-gradient(90deg, #6366f1, #d946ef)', margin: '1rem auto 0 auto', borderRadius: '2px' }}></div>
      </div>
      <div className="d-flex justify-content-center flex-wrap gap-4">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            to={`/shop?category=${cat.id}`} 
            className="category-card-circle text-decoration-none text-center"
            style={{ width: '130px' }}
          >
            <div 
              className="category-circle-img-wrapper"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                margin: '0 auto 12px auto',
                overflow: 'hidden',
                background: '#ffffff',
                border: '3px solid #ffffff',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img 
                src={cat.imageUrl ? (cat.imageUrl.startsWith('/') ? BACKEND_URL + cat.imageUrl : cat.imageUrl) : "https://placehold.co/100"} 
                alt={cat.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease'
                }}
              />
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
        ))}
      </div>
    </section>
  );
};

export default CategoryMenu;
