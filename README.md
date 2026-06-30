# 🚀 NaUCMS.TechGear — ASP.NET Core 9.0 Web API & ReactJS Frontend

Website bán **Đồ Công Nghệ & Gaming Gear** — hệ thống thương mại điện tử hiện đại mang tên **NaUCMS.TechGear**, được xây dựng trên kiến trúc **Full-Stack** với ASP.NET Core 9.0 (Web API & MVC) ở Backend và ReactJS ở Frontend.

> 🎓 **Trường:** Cao đẳng Công Thương TP.HCM  
> 👨‍💻 **Sinh viên:** La Quang Triều — MSSV: 2123110160  

---

## 🆕 Buổi 9 — Nội Dung Cải Tiến & Tính Năng Mới

### 🤖 AI Chatbot (NaUCMS.TechGear AI Assistant)
- **Tích hợp Gemini AI:** Trợ lý ảo AI sử dụng Google Gemini API, được cấu hình với `systemInstruction` để đóng vai trợ lý bán hàng chuyên biệt của cửa hàng NaUCMS.TechGear.
- **Hiển thị Card Sản Phẩm:** Khi chatbot đề cập hoặc gợi ý sản phẩm, hệ thống tự động quét và trả về danh sách sản phẩm tương ứng dưới dạng **card tương tác** ngay trong cửa sổ chat.
- **Thao Tác Nhanh Trên Card:** Mỗi card sản phẩm trong chat có 3 nút hành động:
  - 🛒 **Thêm Vào Giỏ** — Thêm trực tiếp vào giỏ hàng không cần rời khỏi chat.
  - 💳 **Mua Ngay** — Chuyển thẳng sang trang thanh toán với sản phẩm đã chọn.
  - 👁️ **Xem Chi Tiết** — Điều hướng sang trang chi tiết sản phẩm.
- **Lưu Lịch Sử Chat (`localStorage`):** Lịch sử hội thoại được tự động lưu vào `localStorage` để giữ nguyên sau khi F5 (reload trang).
- **Xóa Lịch Sử Chat:** Nút xóa toàn bộ lịch sử hiển thị ngay trong cửa sổ chat.
- **Fallback Responses:** Hệ thống câu trả lời dự phòng có cấu trúc (khi không có API Key) cho các chủ đề: tay cầm chơi game, giao hàng, bảo hành, địa chỉ, thanh toán, chào hỏi và cảm ơn.

---

### 🛍️ Trang Chi Tiết Sản Phẩm (`ProductDetail.jsx`)
- **Thiết kế nâng cấp:** Bố cục hai cột chuyên nghiệp, hiển thị đầy đủ thông tin hình ảnh, giá, giá khuyến mãi, mô tả, số lượng tồn kho.
- **Sản Phẩm Liên Quan:** Tự động hiển thị các sản phẩm cùng danh mục bên dưới, hỗ trợ khám phá thêm.
- **Nút Trở Về:** Nút ← Quay lại cố định ở góc trên bên trái, không bị đẩy xuống sau breadcrumb.
- **Nút Hành Động Nhỏ Gọn:** Nút "Thêm Vào Giỏ" và "Mua Ngay" được điều chỉnh kích thước hợp lý, không chiếm toàn bộ chiều rộng.

---

### 🌐 Đồng Bộ Ngôn Ngữ Tiếng Việt
- Loại bỏ toàn bộ văn bản tiếng Anh còn sót lại trong UI người dùng (nhãn "New", nút, thông báo...).
- Chuẩn hóa toàn bộ giao diện frontend sang Tiếng Việt nhất quán.

---

### 🏷️ Tái Thương Hiệu Toàn Diện → NaUCMS.TechGear
Tất cả các điểm xuất hiện của tên cũ **TrieuCMS** đã được cập nhật sang **NaUCMS.TechGear** trên toàn bộ hệ thống:

| Khu vực | File / Component | Nội dung thay đổi |
|---|---|---|
| Frontend | `Header.jsx` | Logo, tên thương hiệu chính |
| Frontend | `Footer.jsx` | Mô tả, email hỗ trợ, bản quyền |
| Frontend | `AIChatBot.jsx` | Tiêu đề cửa sổ, lời chào AI |
| Frontend | `Support.jsx` | Toàn bộ nội dung trang hỗ trợ |
| Frontend | `Home.jsx` | Mô tả banner fallback |
| Frontend | `public/index.html` | `<title>` & `<meta description>` SEO |
| Backend | `ChatbotController.cs` | `systemInstruction`, fallback responses |
| Backend | `OrdersController.cs` | Tiêu đề & nội dung email xác nhận đơn hàng |
| Backend | `CustomersController.cs` | Tiêu đề email OTP đặt lại mật khẩu |
| Backend | `EmailService.cs` | `SenderName` mặc định |
| Backend | `appsettings.json` | `EmailSettings.SenderName` |
| Backend MVC | `_Layout.cshtml` | Tiêu đề, logo, footer |
| Backend MVC | `_LayoutAdmin.cshtml` | Tiêu đề, sidebar, footer |
| Backend MVC | `Home/Index.cshtml` | Banner chào mừng dashboard |
| Data Layer | `DbSeeder.cs` | Địa chỉ khách hàng mẫu |

---

### 📋 Quản Lý Đơn Hàng (Backend MVC)
- Trang danh sách đơn hàng (`Order/Index.cshtml`) và chi tiết đơn hàng (`Order/Details.cshtml`) được cải thiện giao diện và xử lý dữ liệu.

### 🔐 Quản Lý Người Dùng Admin
- Trang tạo (`User/Create.cshtml`) và chỉnh sửa người dùng (`User/Edit.cshtml`) cải thiện form validation và UX.

---

## 🛠️ Kiến Trúc Hệ Thống

### Backend — ASP.NET Core 9.0
- **Entity Framework Core (Code-First):** Quản lý tự động cơ sở dữ liệu SQL Server với 8 bảng dữ liệu.
- **DbSeeder:** Tự động sinh dữ liệu mẫu phong phú (sản phẩm Gaming Gear, bài viết, khách hàng, đơn hàng).
- **Bảo Mật Mật Khẩu:** Mã hóa một chiều **PBKDF2 (SHA-256)** với Salt ngẫu nhiên 16-byte.
- **Email Service:** Gửi email xác nhận đơn hàng & OTP đặt lại mật khẩu. Log email vào file khi không có SMTP credentials.
- **Gemini AI Integration:** Tích hợp Google Gemini API cho tính năng AI Chatbot.
- **Swagger UI:** Tài liệu API tương tác tích hợp sẵn.

### Frontend — ReactJS
- **Axios Client:** Giao tiếp API với backend qua `axiosClient`.
- **React Router:** Điều hướng đa trang (Home, Shop, ProductDetail, Checkout, MyOrders, Profile...).
- **Toast Notifications:** Hệ thống thông báo `ToastContext` tùy chỉnh (không dùng `alert()`).
- **localStorage Cart & Auth:** Giỏ hàng và phiên đăng nhập được lưu cục bộ.

---

## 📂 Cấu Trúc Cơ Sở Dữ Liệu (8 Bảng)

| # | Bảng | Mô tả |
|---|---|---|
| 1 | `Categories` | Danh mục bài viết / tin tức |
| 2 | `Posts` | Danh sách bài viết |
| 3 | `Users` | Thành viên quản trị (Admin, Editor, Moderator, User) |
| 4 | `CategoriesProducts` | Danh mục sản phẩm (Tay cầm, Điện thoại, Laptop...) |
| 5 | `Products` | Danh sách sản phẩm với giá, khuyến mãi, tồn kho |
| 6 | `Customers` | Khách hàng đăng ký mua sắm |
| 7 | `Orders` | Đơn đặt hàng |
| 8 | `OrderDetails` | Chi tiết từng mặt hàng trong đơn hàng |
| 9 | `Advertisements` | Banner quảng cáo trang chủ |

---

## 🚀 Hướng Dẫn Chạy Dự Án

### Yêu Cầu Hệ Thống
- .NET 9 SDK
- Node.js 18+ & npm
- SQL Server (LocalDB hoặc SQLEXPRESS)

### 1. Cấu Hình Database

Chuỗi kết nối trong `CMS.Backend/appsettings.json`:
```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=TrieuCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```
Thay đổi `Server` nếu cần thiết. Database và dữ liệu mẫu sẽ được tự động tạo khi Backend khởi động lần đầu.

### 2. Cấu Hình AI Chatbot (Tùy chọn)

Thêm Gemini API Key vào `appsettings.json` để kích hoạt AI thực sự:
```json
"Gemini": {
  "ApiKey": "YOUR_GEMINI_API_KEY_HERE"
}
```
> Nếu không cấu hình API Key, chatbot sẽ dùng chế độ **Fallback** với các câu trả lời có sẵn.

### 3. Khởi Chạy Tất Cả Cùng Lúc (Khuyên Dùng)
```bat
run_all.bat
```

### 4. Hoặc Chạy Thủ Công

**Backend:**
```bash
cd CMS.Backend
dotnet run --launch-profile https
```
Truy cập Swagger: `https://localhost:7226/swagger`

**Frontend:**
```bash
cd cms.frontend
npm install   # Chỉ lần đầu
npm start
```
Truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Tài Khoản Mặc Định

### Admin (Backend MVC Dashboard)
| Tài khoản | Mật khẩu |
|---|---|
| `admin` | `admin123` |

### Khách Hàng (Frontend Store)
| Email | Mật khẩu |
|---|---|
| `trieu@gmail.com` | `123` |
| `thai@cms.edu.vn` | `123` |

---

## 📌 Lịch Sử Các Buổi Học

| Buổi | Nội dung chính |
|---|---|
| Buổi 1–3 | Khởi tạo dự án, Entity Framework Core, CRUD cơ bản |
| Buổi 4–5 | REST API, xác thực JWT, mã hóa mật khẩu PBKDF2 |
| Buổi 6 | Tích hợp ReactJS Frontend, Axios, React Router |
| Buổi 7 | Giỏ hàng, đặt hàng, quản lý đơn hàng, email xác nhận |
| Buổi 8 | CKEditor upload ảnh, tìm kiếm thời gian thực, slider sản phẩm, Toast UI, SweetAlert2 |
| **Buổi 9** | **AI Chatbot (Gemini), card sản phẩm trong chat, ProductDetail nâng cấp, tái thương hiệu NaUCMS.TechGear, đồng bộ tiếng Việt** |

---

## 📞 Thông Tin Cửa Hàng

- 📍 **Địa chỉ:** 63/6 đường 2, Phường Tăng Nhơn Phú B, TP Thủ Đức, TP. Hồ Chí Minh
- 🕗 **Giờ mở cửa:** 8:00 – 22:00 (Tất cả các ngày)
- 📞 **Hotline:** 0973 651 140
- 📧 **Email hỗ trợ:** support@naucmstechgear.vn
