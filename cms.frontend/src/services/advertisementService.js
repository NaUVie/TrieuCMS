import axiosClient from '../api/axiosClient';

const advertisementService = {
    getActiveBanners: async () => {
        return await axiosClient.get('/Advertisements');
    }
};

export default advertisementService;
