import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogService from '../services/blogService';
import { BACKEND_URL } from '../api/axiosClient';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await blogService.getAllPosts();
        const matched = data.find(p => p.id === parseInt(id));
        setPost(matched);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-spinner py-5">
        <i className="fa-solid fa-spinner"></i> Đang tải nội dung bài viết...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-5">
        <h4 className="text-muted">Không tìm thấy bài viết này trong hệ thống.</h4>
        <Link to="/" className="btn-login mt-3 d-inline-block text-decoration-none">Quay lại trang chủ</Link>
      </div>
    );
  }

  const imageUrl = post.imageUrl?.startsWith('/') ? BACKEND_URL + post.imageUrl : post.imageUrl;

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <nav aria-label="breadcrumb" style={{ marginBottom: '2rem' }}>
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
          <li className="breadcrumb-item active">Đánh giá tin tức</li>
        </ol>
      </nav>

      <article>
        <header className="mb-4">
          <span className="blog-card-category" style={{ fontSize: '0.85rem' }}>{post.categoryName || 'Tin tức'}</span>
          <h1 className="fw-bold mb-2" style={{ color: '#111827', fontSize: '2.5rem' }}>{post.title}</h1>
          <div className="text-muted small">
            <i className="fa-regular fa-calendar-days me-2"></i>
            Ngày đăng: {new Date(post.createdDate).toLocaleDateString('vi-VN')}
          </div>
        </header>

        <div className="mb-4" style={{ borderRadius: '24px', overflow: 'hidden', maxHeight: '400px' }}>
          <img 
            src={imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&auto=format&fit=crop'} 
            alt={post.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <section 
          className="post-content" 
          style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#374151' }}
          dangerouslySetInnerHTML={{ __html: post.content || '<p>Chưa có nội dung chi tiết.</p>' }}
        />
      </article>

      <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '2rem' }}>
        <Link to="/" className="btn-login text-decoration-none d-inline-block">
          <i className="fa-solid fa-arrow-left me-2"></i> Quay lại Trang chủ
        </Link>
      </div>
    </div>
  );
}

export default PostDetail;
