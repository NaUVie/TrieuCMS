1	Khởi tạo Solution đúng cấu trúc 3 phân tầng (CMS.Data, CMS.Backend, cms.frontend) hiển thị trên GitHub.
2	Lịch sử Git có tối thiểu 5 lần Commit tương ứng với tiến độ các buổi học thực hành.
3	"File README.md trên GitHub có hướng dẫn đầy đủ cách chạy Backend (F5) và FrontEnd (npm start).
Loại bỏ thư mục rác node_modules/, bin/, obj/ ra khỏi Git thông qua file .gitignore chuẩn."

10	Khai báo đầy đủ 8 class với các trường cấu trúc của 8 thực thể 
11	"Cấu hình thành công ApplicationDbContext và chạy lệnh Migration để sinh ra đủ 8 bảng dữ liệu thật trong SQL Server.
File appsettings.json cấu hình chuỗi kết nối (Connection String) chuẩn hóa, kết nối thông suốt với máy chủ cơ sở dữ liệu."
12	Tạo đầy đủ các trang quản tri với CRUD hợp lý với Category, Post, User 
13	Tạo đầy đủ các trang quản tri với CRUD hợp lý với CategoryProduct, Product, Customer, Order --> OrderDetail 
14	Có chức năng phân trang đối với danh sách liệt kê quá nhiều ProductGrid, PostGrid
15	Tích hợp thành công trình soạn thảo giàu tính năng (Rich Text Editor như CKEditor) vào ô nhập liệu nội dung chi tiết bài viết.
16	Ứng dụng thành công thuộc tính bảo mật [Authorize] để khóa chặn những người chưa đăng nhập không được vào xem dữ liệu Admin.
17	Phân quyền cấp cao [Authorize(Roles = "Admin")] cho file UserController.cs để chỉ tài khoản Admin mới được quản lý thành viên.
18	"Hoàn thiện giao diện Layout chung (_LayoutAdmin.cshtml) chứa thanh điều hướng Sidebar thông minh điều phối các thực thể.
Trang Admin hiển thị động tên người dùng đang đăng nhập (FullName) và vai trò (Role) lên thanh điều hướng."
19	"Xây dựng hoàn chỉnh trang đăng nhập Login.cshtml hoạt động độc lập, không bị lỗi crash code khi người dùng nhập sai thông tin.
Viết hàm hành động Logout giải phóng hoàn toàn Session/Cookie và điều hướng an toàn người dùng về trang Login."
20	Viết đủ Web API GET phục vụ cho Frontend
21	Viết đủ Web API POST phục vụ cho Frontend
22	Cấu hình chính sách bảo mật CORS (AllowReactApp) mở cổng Port chính xác cho ứng dụng ReactJS nạp dữ liệu.
23	File Program.cs thiết lập thành công cấu trúc Middleware lai: vừa ánh xạ API (MapControllers) vừa giữ định tuyến Web MVC cũ.
24	Trang chủ FrontEnd có giao diện hợp lý được chia thành 5 hay 6 Component trình bày: Header, HeroBanner, CategoryMenu, ProductGrid…. 
25	Tất cả link trên trang chủ hoạt động đúng chức năng không gây ra lỗi
26	Phần <HeroBanner /> trên trang chủ trình bày hiệu ứng slide hay scroll có hình ảnh/nội dung lấy từ Post/Product/Category/… hay từ table mới Advertisment 
27	Trang chi tiết sản phẩm, hiển thị trọn vẹn mô tả sản phẩm. Trang chi tiết bài viết hiển thị đầy đủ nội dung và hình ảnh
28	Giao diện trang Giỏ hàng (Cart.jsx) quản lý mảng dữ liệu tốt, cho phép tăng/giảm số lượng mua và tính tổng tiền chuẩn xác trước khi chốt đơn.
29	Luồng thanh toán (Checkout.jsx) bắt lỗi form tốt, ép người mua phải nhập đầy đủ các thông tin liên hệ bắt buộc (FullName, Phone, Address).
30	Thao tác "Bấm Đặt Hàng" gửi thành công yêu cầu POST xuống Backend, hệ thống tạo bản ghi Đơn hàng mới và trừ bớt số lượng sản phẩm tồn kho trong database.
31	Có chức năng gửi email thông tin đơn hàng cho khách
32	Khi vận hành demo toàn bộ dự án FrontEnd ReactJS, bật phím F12 chuyển sang tab Console màn hình không xuất hiện bất kỳ dòng báo lỗi đỏ (Error) nào liên quan đến API hay CORS.
33	Thực thể Customer và User không lưu mật khẩu thô. Hệ thống ứng dụng thành công thuật toán mã hóa một chiều (như BCrypt hoặc mã hóa SHA256 kèm chuỗi Salt) để băm mật khẩu trước khi lưu vào SQL Server.
34	Luồng đăng ký khách hàng (CustomerRegister) kiểm tra trùng lặp Email trong cơ sở dữ liệu và mã hóa mật khẩu tự động trước khi chạy lệnh lưu bản ghi.
35	Trình soạn thảo CKEditor trong trang Admin cấu hình thành công tính năng upload và chèn hình ảnh trực tiếp vào giữa nội dung bài viết (Content lưu dưới dạng mã HTML).
36	Tại trang chủ, thiết kế một vùng giao diện (Component) riêng biệt, gọi API dữ liệu mới nhất và render thành công 3 thẻ sản phẩm mới lên màn hình.
37	Thiết kế khu vực "Sản phẩm Hot / Bán chạy" tại trang chủ, hiển thị mượt mà dữ liệu 3 sản phẩm bán chạy nhất được trả về từ Backend.
38	Tại Tầng 3 (<CategoryMenu />) hoặc trang chủ, các danh mục quần áo hiển thị theo dạng các khối tròn/vuông chứa ảnh đại diện của ngành hàng đó, kích thích người dùng click chọn.
39	Tại trang Shop.jsx, xây dựng thanh trượt giá (Range Slider) hoặc 2 ô nhập Đơn giá Min - Đơn giá Max. Khi người dùng thay đổi, ReactJS tự động gọi API lọc giá ngầm và cập nhật lại lưới sản phẩm.
40	Trên thanh Header chung, tích hợp ô tìm kiếm. Khi sinh viên gõ ký tự, hệ thống kích hoạt gọi API Search và điều hướng người dùng sang trang hiển thị kết quả tìm kiếm tương ứng.
41	Trên biểu tượng chiếc giỏ hàng ở Header, sử dụng Hook trạng thái để hiển thị một bong bóng số đỏ (Badge) tự động cập nhật số lượng sản phẩm hiện có trong giỏ hàng theo thời gian thực.
42	Khi bấm mua hàng ở trang chi tiết, nếu số lượng khách chọn vượt quá trường StockQuantity trong database, ReactJS phải chặn lại và đưa ra cảnh báo: "Số lượng sản phẩm trong kho không đủ!".
43	Khi bộ lọc khoảng giá hoặc từ khóa tìm kiếm không trả về kết quả nào, trang web phải hiển thị hình ảnh minh họa kèm dòng chữ: "Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn".
44	Trang chi tiết bài viết nhận dữ liệu có chứa mã HTML từ CKEditor gửi về, ứng dụng thuộc tính dangerouslySetInnerHTML của React để hiển thị bài viết đầy đủ định dạng (chữ đậm, chữ nghiêng, căn lề, hình ảnh nằm giữa bài) mà không lộ thẻ code thô.
45	Phía ReactJS không viết cứng (Hardcode) chuỗi domain Backend, sinh viên biết cách cấu hình hằng số IMAGE_BASE_URL và API Base URL thông qua file môi trường .env (REACT_APP_API_URL) chuẩn cấu trúc doanh nghiệp.
46	Tạo chức năng Forgot Pasword cho khách hàng
47	Kỷ luật tiến độ & Đồng bộ hóa mã nguồn (Git Discipline)
48	Tinh thần làm việc nhóm & Phân rã công việc (Teamwork & Task Allocation)
49	Kỹ năng giao tiếp & Thuyết trình Demo (Presentation & Communication)
50	Tư duy giải quyết vấn đề & Khả năng tự học (Problem Solving & Self-learning)



trừ tiêu chí 4 đến 