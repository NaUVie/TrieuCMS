import React from 'react';
import { BACKEND_URL } from '../api/axiosClient';

const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&auto=format&fit=crop';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return BACKEND_URL + url;
    return BACKEND_URL + '/uploads/' + url;
};

const PostDetailModal = ({ post, isOpen, onClose }) => {
    if (!isOpen || !post) return null;

    return (
        <div className="detail-overlay" onClick={onClose}>
            <div className="detail-modal-card" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="detail-close-btn" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div style={{ padding: '1.5rem' }}>
                    <div className="blog-card-category" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {post.categoryName || 'Tin tức'}
                    </div>
                    <h2 className="detail-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{post.title}</h2>
                    
                    <div className="blog-card-date" style={{ marginBottom: '1.5rem', color: '#9ca3af' }}>
                        <i className="fa-regular fa-calendar"></i> &nbsp;
                        {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                    </div>

                    <div className="detail-img-wrapper" style={{ width: '100%', height: '350px', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
                        <img 
                            src={getImageUrl(post.imageUrl)} 
                            alt={post.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    <div 
                        className="post-detail-content" 
                        style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#374151' }}
                        dangerouslySetInnerHTML={{ __html: post.content || '<p>Chưa có nội dung chi tiết.</p>' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PostDetailModal;
