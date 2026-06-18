import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';
import { BACKEND_URL } from '../api/axiosClient';

// Hàm ghép đường dẫn ảnh: nếu ảnh bắt đầu bằng "/" (upload từ admin) thì thêm domain Backend
const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400&auto=format&fit=crop';
    if (url.startsWith('/')) return BACKEND_URL + url;
    return url;
};
const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner">
                <i className="fa-solid fa-spinner"></i> Đang tải tin tức...
            </div>
        );
    }

    if (posts.length === 0) {
        return <p className="text-muted text-center py-5">Chưa có bài viết tin tức nào.</p>;
    }

    return (
        <div className="row">
            {posts.map((post) => (
                <div className="col-lg-6 col-md-6 mb-4" key={post.id}>
                    <a href={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="blog-card">
                            <img 
                                src={getImageUrl(post.imageUrl)} 
                                alt={post.title} 
                                className="blog-card-img" 
                            />
                            <div className="blog-card-body">
                                <span className="blog-card-category">
                                    {post.categoryName || 'Tin tức'}
                                </span>
                                <h5 className="blog-card-title">{post.title}</h5>
                                <p className="blog-card-excerpt">
                                    {post.content 
                                        ? post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...'
                                        : 'Đang cập nhật nội dung tóm tắt cho bài viết thời trang này...'}
                                </p>
                                <div className="blog-card-meta">
                                    <span className="blog-card-date">
                                        <i className="fa-regular fa-calendar"></i>
                                        {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span className="blog-card-link">
                                        Đọc tiếp <i className="fa-solid fa-arrow-right"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            ))}
        </div>
    );
};

export default PostList;
