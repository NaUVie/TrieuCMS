import axiosClient from '../api/axiosClient';

const orderService = {
    createOrder: async (orderData) => {
        return await axiosClient.post('/Orders', orderData);
    },
    getCustomerOrders: async (customerId) => {
        return await axiosClient.get(`/Orders/customer/${customerId}`);
    }
};

export default orderService;
