import axiosClient from '../api/axiosClient';

const blogService = {
    getBlogCategories: () => {
        const url = '/Categories'; 
        return axiosClient.get(url);
    },

    getAllPosts: () => {
        const url = '/Posts';
        return axiosClient.get(url);
    }
};

export default blogService;
