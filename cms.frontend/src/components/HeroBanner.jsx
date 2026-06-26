import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = ({ bannerSlides, currentSlide }) => {
  if (!bannerSlides || bannerSlides.length === 0) return null;
  
  const slide = bannerSlides[currentSlide] || bannerSlides[0];
  
  return (
    <div 
      className="hero-banner" 
      style={{ 
        backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.4), rgba(17, 24, 39, 0.85)), url(${slide.imageUrl})`,
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
          {slide.badge}
        </span>
        <h1 style={{ color: '#ffffff', textShadow: '0 4px 12px rgba(0,0,0,0.5)', fontWeight: '800', fontSize: '3.2rem', lineHeight: '1.2', marginBottom: '1.25rem', maxWidth: '800px' }}>{slide.title}</h1>
        <p style={{ color: '#f3f4f6', opacity: 0.9, textShadow: '0 2px 6px rgba(0,0,0,0.4)', maxWidth: '680px', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>{slide.desc}</p>
        <Link to={slide.linkUrl || "/shop"} className="hero-cta" style={{ background: 'linear-gradient(135deg, #4f46e5, #db2777)', padding: '14px 32px', borderRadius: '30px', fontWeight: '700', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)', transition: 'all 0.3s' }}>
          Khám phá ngay <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  );
};

export default HeroBanner;
