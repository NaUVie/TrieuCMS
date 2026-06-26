# 📝 Báo Cáo Thay Đổi & Cập Nhật - Buổi 8 (NaUCMS.TechGear)

Tệp này ghi nhận toàn bộ các hạng mục công việc đã thực hiện, tối ưu hóa và phát triển mới trong buổi học thực hành số 8 đối với dự án **NaUCMS.TechGear**.

---

## 🛠️ Các Hạng Mục Công Việc Đã Thực Hiện

### 1. Tái Cấu Trúc Frontend (Modularization)
*   **Chia nhỏ Trang chủ (`Home.jsx`)**: Tách tệp mã nguồn Trang chủ cồng kềnh thành **6 Component độc lập** đặt tại thư mục `cms.frontend/src/components/`:
    *   `Header.jsx`: Thanh điều hướng toàn cục, hiển thị số lượng giỏ hàng thời gian thực.
    *   `Footer.jsx`: Chân trang đa cột cao cấp.
    *   `HeroBanner.jsx`: Quảng cáo và Banner động gọi từ Web API.
    *   `CategoryMenu.jsx`: Menu điều hướng danh mục sản phẩm trực quan.
    *   `ProductGrid.jsx`: Danh sách sản phẩm dạng lưới, phân tách Sản phẩm mới và Sản phẩm giảm giá.
    *   `BlogSection.jsx`: Hiển thị tin tức và bài viết.
*   **Lợi ích**: Tối ưu hóa hiệu năng render, tăng khả năng tái sử dụng mã nguồn và giúp code sạch sẽ, dễ bảo trì.

### 2. Thiết Kế & Phát Triển Trang Chính Sách Hỗ Trợ (`Support.jsx`)
*   **Trang mới**: Phát triển mới trang hỗ trợ khách hàng đa Tab linh hoạt tại địa chỉ `/support`.
*   **Nội dung chính sách**:
    *   *Hướng dẫn mua hàng*: Quy trình mua hàng 4 bước chuyên nghiệp.
    *   *Chính sách bảo hành*: Chi tiết thời gian bảo hành cho từng loại Gaming Gear và điều kiện áp dụng.
    *   *Đổi trả trong 30 ngày*: Quy trình 1-đổi-1 cho lỗi nhà sản xuất.
    *   *Chính sách bảo mật*: Biện pháp bảo vệ thông tin cá nhân khách hàng bằng giao thức SSL/TLS.
*   **Liên kết thông suốt**: Footer của website đã được cấu hình liên kết động thông qua `react-router-dom` để chuyển hướng trực tiếp vào đúng Tab nội dung tương ứng của trang hỗ trợ.

### 3. Đồng Bộ Hóa Chủ Đề Website Gaming Gear (`NaUCMS.TechGear`)
*   **Cập nhật thương hiệu**: Chuyển đổi tên và chủ đề dự án thành **NaUCMS.TechGear** (Chuyên kinh doanh chuột gaming, bàn phím cơ, tai nghe, lót chuột led, tay cầm chơi game).
*   **Bài viết mẫu (Seed Data)**: Cập nhật cơ sở dữ liệu để tự động nạp các bài đăng chuyên sâu:
    1.  *Hướng dẫn custom bàn phím cơ cho người mới*
    2.  *Top chuột gaming dưới 1 triệu đáng mua nhất*
    3.  *Cách chọn tai nghe Gaming Gear chuẩn Esport chuyên nghiệp*
    4.  *Lót chuột LED RGB - Phụ kiện không thể thiếu góc máy gaming*
*   **Sản phẩm mẫu (Product Seed)**: Tích hợp đầy đủ danh mục tay cầm chơi game cao cấp (Flydigi, 8BitDo, Gamesir) với đầy đủ hình ảnh thực tế từ internet, thông số tồn kho và giá khuyến mãi.

### 4. Tối Ưu Hóa Kỹ Thuật (Backend & Build)
*   **Hỗ trợ HTTPS**: Cấu hình khởi chạy backend qua launch profile `https` để giải quyết triệt để lỗi kết nối `net::ERR_CONNECTION_REFUSED` ở địa chỉ cổng bảo mật `https://localhost:7226`.
*   **Báo cáo môn học**: Cập nhật lại tệp tài liệu báo cáo `BaoCao_TieuChi_TrieuCMS.docx` khớp với toàn bộ các thay đổi kiến trúc và dữ liệu mẫu thực tế của dự án.

---

## 🚀 Hướng Dẫn Chạy Nhánh `buoi_8`

### Khởi động Backend
```bash
cd CMS.Backend
dotnet run --launch-profile https
```

### Khởi động Frontend
```bash
cd cms.frontend
npm start
```
*Giao diện Storefront ReactJS sẽ tự động khởi chạy tại địa chỉ [http://localhost:3000](http://localhost:3000).*
