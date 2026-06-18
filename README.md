# 🚀 TrieuCMS Solution (ASP.NET Core Web API & ReactJS Frontend)

Hệ thống quản lý nội dung và thương mại điện tử **TrieuCMS** được xây dựng bằng kiến trúc hiện đại, kết hợp sức mạnh của **ASP.NET Core 9.0 (Web API & MVC)** ở Backend và sự linh hoạt của **ReactJS** ở Frontend.

---

## 🛠️ Kiến Trúc Hệ Thống & Tính Năng Nổi Bật

- **Backend (ASP.NET Core 9.0)**:
  - **Entity Framework Core**: Quản lý cơ sở dữ liệu SQL Server tự động bằng Code-First Migrations (8 bảng dữ liệu thực).
  - **Database Seeder**: Tự động sinh dữ liệu mẫu phong phú về sản phẩm, bài viết, người dùng và đơn hàng khi khởi động.
  - **Mật khẩu Bảo mật**: Mã hóa một chiều sử dụng thuật toán **PBKDF2 (SHA256)** với Salt ngẫu nhiên 16-byte, tránh lưu mật khẩu thô cho cả quản trị viên (`User`) và khách hàng (`Customer`).
  - **API Documentation**: Tích hợp sẵn **Swagger UI** trực quan để kiểm thử và tích hợp API.
- **Frontend (ReactJS)**:
  - Giao diện người dùng hiện đại, thiết kế theo ngôn ngữ Clean & Premium.
  - Kết nối Web API thông suốt thông qua `axiosClient`.

---

## 📂 Danh Sách 8 Bảng Dữ Liệu SQL Server

1. `Categories` - Danh mục bài viết / tin tức.
2. `Posts` - Danh sách bài viết.
3. `Users` - Thành viên tham gia quản trị hệ thống (Admin, Editor, Moderator, User).
4. `CategoriesProducts` - Danh mục sản phẩm.
5. `Products` - Danh sách sản phẩm (Điện thoại, Laptop, Phụ kiện, TV, Đồng hồ).
6. `Customers` - Khách hàng đăng ký mua sắm.
7. `Orders` - Đơn đặt hàng của khách hàng.
8. `OrderDetails` - Chi tiết mặt hàng và số lượng của từng đơn hàng.

---

## 🚀 Hướng Dẫn Chạy Dự Án

### 1. Chuẩn bị Cơ sở dữ liệu (SQL Server)
- Đảm bảo máy tính đã cài đặt **SQL Server (LocalDB hoặc SQLEXPRESS)**.
- Kết nối mặc định được cấu hình trong `CMS.Backend/appsettings.json`:
  ```json
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TrieuCMS_DB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  ```
- *Lưu ý*: Bạn có thể thay đổi chuỗi kết nối này để phù hợp với cấu hình SQL Server trên máy của mình.

---

### 💻 Hướng Dẫn Khởi Chạy Backend (ASP.NET)

Bạn có thể chạy dự án Backend bằng 2 cách dưới đây:

#### Cách A: Chạy từ Visual Studio hoặc VS Code (Khuyên dùng - Nhấn F5)
1. Mở file giải pháp `TrieuCMS_Solution.sln` bằng Visual Studio hoặc VS Code.
2. Thiết lập dự án khởi động (Startup Project) là `CMS.Backend`.
3. Nhấn phím **`F5`** (hoặc nút **Start** trên thanh công cụ) để build và chạy ứng dụng ở chế độ Debug.
4. Trình duyệt sẽ tự động mở trang Swagger UI tại: `https://localhost:5001/swagger/index.html` hoặc `http://localhost:5000/swagger/index.html`.

#### Cách B: Chạy qua dòng lệnh (CLI)
1. Mở terminal tại thư mục gốc của dự án.
2. Di chuyển vào thư mục dự án Backend:
   ```bash
   cd CMS.Backend
   ```
3. Chạy lệnh:
   ```bash
   dotnet run
   ```
4. Truy cập Swagger UI tại địa chỉ: `https://localhost:5001/swagger` hoặc `http://localhost:5000/swagger`.

---

### 🌐 Hướng Dẫn Khởi Chạy Frontend (ReactJS)

1. Mở một terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các gói thư viện phụ thuộc (chỉ cần làm ở lần đầu chạy):
   ```bash
   npm install
   ```
3. Khởi chạy ứng dụng Frontend:
   ```bash
   npm start
   ```
4. Ứng dụng Frontend ReactJS sẽ chạy tại địa chỉ: [http://localhost:3000](http://localhost:3000).

---

## 🔒 Cơ Chế Mã Hóa Mật Khẩu (Security)

Hệ thống triển khai lớp bảo mật `PasswordHasher` tại `CMS.Data/Security/PasswordHasher.cs`:
- Sử dụng phương thức mã hóa **PBKDF2** với **SHA-256** và **10,000 vòng lặp (iterations)** cùng **Salt ngẫu nhiên 16-byte**.
- Mật khẩu băm lưu vào cơ sở dữ liệu có dạng chuỗi Base64 gồm 48 bytes (16 bytes Salt + 32 bytes Hash).
- **Luồng Đăng ký Khách hàng (`CustomerRegister`)**:
  - Tự động kiểm tra trùng lặp email (`Email`) trong cơ sở dữ liệu trước khi đăng ký.
  - Tự động mã hóa mật khẩu thô nhận được từ người dùng trước khi lưu bản ghi.
- **Dữ liệu mẫu (Seed Data)**:
  - Khi ứng dụng Backend khởi chạy, lớp `DbSeeder` sẽ quét cơ sở dữ liệu, nếu phát hiện tài khoản cũ nào đang có mật khẩu dạng thô (plain-text), hệ thống sẽ **tự động băm và cập nhật bảo mật** trực tiếp vào SQL Server.
