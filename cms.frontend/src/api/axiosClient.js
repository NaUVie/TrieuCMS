import axios from 'axios';

// Địa chỉ gốc của Backend (dùng để ghép đường dẫn ảnh upload)
export const BACKEND_URL = 'https://localhost:7226';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    baseURL: `${BACKEND_URL}/api`, // Cổng Port Backend
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// Interceptor giúp chúng ta can thiệp vào dữ liệu trước khi trả về cho component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục data bên trong dữ liệu JSON
        return response.data;
    },
    (error) => {
        // Xử lý lỗi tập trung tại đây
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;

