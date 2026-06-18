import React, { useState, useEffect } from 'react';
import categoryProductService from '../services/categoryProductService';

const CategoryProductList = ({ activeId, onSelectCategory }) => {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategoryProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, []);

    if (loading) {
        return (
            <div className="sidebar-card">
                <div className="loading-spinner">
                    <i className="fa-solid fa-spinner"></i> Đang tải...
                </div>
            </div>
        );
    }

    return (
        <div className="sidebar-card">
            <h5><i className="fa-solid fa-layer-group mr-2"></i> Danh mục</h5>

            <button
                className={`cat-item ${activeId === null ? 'active' : ''}`}
                onClick={() => onSelectCategory(null)}
            >
                <span>Tất cả sản phẩm</span>
                <span className="cat-count">All</span>
            </button>

            {categoryProducts.map((item) => (
                <button
                    key={item.id}
                    className={`cat-item ${activeId === item.id ? 'active' : ''}`}
                    onClick={() => onSelectCategory(item.id)}
                >
                    <span>{item.name}</span>
                    <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.65rem', opacity: 0.4 }}></i>
                </button>
            ))}
        </div>
    );
};

export default CategoryProductList;

