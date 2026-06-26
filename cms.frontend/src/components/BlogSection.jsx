import React from 'react';
import { Link } from 'react-router-dom';

const BlogSection = ({ posts, BACKEND_URL }) => {
  if (!posts || posts.length === 0) return null;

  return (
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
  );
};

export default BlogSection;
