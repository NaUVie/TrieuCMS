import axiosClient from '../api/axiosClient';

const productService = {
    getAllProducts: () => {
        const url = '/Products'; 
        return axiosClient.get(url);
    },
    getProductById: (id) => {
        const url = `/Products/${id}`;
        return axiosClient.get(url);
    },
    getSaleProducts: () => {
        const url = '/Products/sale';
        return axiosClient.get(url);
    },
    getLatestProducts: () => {
        const url = '/Products/latest';
        return axiosClient.get(url);
    }
};

export default productService;
