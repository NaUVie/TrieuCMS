import axiosClient from '../api/axiosClient';

const customerService = {
    getProfile: (id) => {
        return axiosClient.get(`/Customers/${id}`);
    },
    updateProfile: (id, data) => {
        return axiosClient.put(`/Customers/${id}`, data);
    }
};

export default customerService;
