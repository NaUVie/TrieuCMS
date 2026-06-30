import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { BACKEND_URL } from '../api/axiosClient';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatId, setSelectedCatId] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const allPosts = await blogService.getAllPosts();
        setPosts(allPosts);

        const cats = await blogService.getBlogCategories();
        setCategories(cats);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogData();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner py-5">
        <i className="fa-solid fa-spinner"></i> Đang tải danh sách bài viết...
      </div>
    );
  }

  // Filter posts by search and category
  let filteredPosts = posts;
  if (selectedCatId) {
    filteredPosts = filteredPosts.filter(p => p.categoryId === selectedCatId);
  }
  if (searchTerm.trim() !== '') {
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (p.content && p.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  return (
    <div className="container mt-4">
      {/* Page Title */}
      <div className="section-heading">
        <h4><i className="fa-solid fa-newspaper text-primary me-2"></i>Tin Tức Công Nghệ</h4>
      </div>

      <div className="row g-4">
        {/* Sidebar Categories */}
        <div className="col-lg-3 col-md-4">
          <div className="sidebar-card">
            <h5>Chủ đề bài viết</h5>
            <button 
              className={`cat-item ${selectedCatId === null ? 'active' : ''}`}
              onClick={() => setSelectedCatId(null)}
            >
              <span>Tất cả bài viết</span>
              <span className="cat-count">{posts.length}</span>
            </button>
            {categories.map(cat => {
              const count = posts.filter(p => p.categoryId === cat.id).length;
              return (
                <button 
                  key={cat.id} 
                  className={`cat-item ${selectedCatId === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCatId(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="col-lg-9 col-md-8">
          {/* Search Toolbar */}
          <div className="product-toolbar mb-4">
            <div className="search-box-wrapper">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input 
                type="text" 
                className="form-control search-input" 
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="no-products-found py-5 text-center">
              <i className="fa-solid fa-folder-open mb-3 display-4 text-muted"></i>
              <p className="text-muted fs-5">Chưa có bài viết nào thuộc chủ đề này.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="col-12">
                  <div className="blog-card" style={{ display: 'flex', background: '#ffffff', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.04)', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <img 
                      src={post.imageUrl?.startsWith('/') ? BACKEND_URL + post.imageUrl : post.imageUrl} 
                      alt={post.title} 
                      className="blog-card-img" 
                      style={{ width: '220px', height: '160px', objectFit: 'cover' }} 
                    />
                    <div className="blog-card-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span className="blog-card-category" style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {post.categoryName || 'Tin tức'}
                      </span>
                      <h5 className="blog-card-title" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1f2937', marginBottom: '8px', lineHeight: '1.4' }}>
                        <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          {post.title}
                        </Link>
                      </h5>
                      <p className="blog-card-excerpt" style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                        {post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Chưa có nội dung mô tả sơ lược.'}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                          <i className="fa-regular fa-calendar-days me-1"></i> {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                        </span>
                        <Link to={`/post/${post.id}`} className="blog-card-link" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#4f46e5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Đọc tiếp <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blog;
