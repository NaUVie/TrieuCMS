import axiosClient from '../api/axiosClient';

const authService = {
    register: (data) => {
        const url = '/Auth/CustomerRegister';
        return axiosClient.post(url, data);
    },

    login: (data) => {
        const url = '/Auth/CustomerLogin';
        return axiosClient.post(url, data);
    },

    forgotPassword: (email) => {
        const url = '/Customers/forgot-password';
        return axiosClient.post(url, { email });
    },

    resetPassword: (data) => {
        const url = '/Customers/reset-password';
        return axiosClient.post(url, data);
    }
};

export default authService;
