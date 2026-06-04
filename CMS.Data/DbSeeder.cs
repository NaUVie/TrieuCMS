using System;
using System.Collections.Generic;
using System.Linq;
using CMS.Data.Entities;

namespace CMS.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            // 1. Seed Categories
            if (!context.Categories.Any())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Tin tức Công nghệ", Description = "Cập nhật xu hướng AI, IoT và lập trình." },
                    new Category { Name = "Đời sống du lịch", Description = "Kinh nghiệm phượt và các điểm đến hấp dẫn." },
                    new Category { Name = "Sức khỏe Thể thao", Description = "Các bài tập và chế độ ăn uống lành mạnh." },
                    new Category { Name = "Giáo dục Kỹ năng", Description = "Phương pháp học tập và kỹ năng mềm." },
                    new Category { Name = "Góc lập trình viên", Description = "Tài liệu ASP.NET Core và SQL Server." }
                };
                context.Categories.AddRange(categories);
                context.SaveChanges();
            }

            // 2. Seed Posts
            if (!context.Posts.Any())
            {
                // Retrieve actual Category IDs after insertion
                var techCat = context.Categories.FirstOrDefault(c => c.Name == "Tin tức Công nghệ");
                var travelCat = context.Categories.FirstOrDefault(c => c.Name == "Đời sống du lịch");
                var sportCat = context.Categories.FirstOrDefault(c => c.Name == "Sức khỏe Thể thao");
                var eduCat = context.Categories.FirstOrDefault(c => c.Name == "Giáo dục Kỹ năng");
                var devCat = context.Categories.FirstOrDefault(c => c.Name == "Góc lập trình viên");

                var posts = new List<Post>
                {
                    new Post
                    {
                        Title = "Lộ trình học ASP.NET",
                        Content = "Hướng dẫn chi tiết cho người mới bắt đầu học lập trình web với ASP.NET Core MVC và Web API từ cơ bản đến nâng cao.",
                        ImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
                        CategoryId = devCat?.Id ?? 5,
                        CreatedDate = new DateTime(2026, 4, 1)
                    },
                    new Post
                    {
                        Title = "Top 5 bãi biển đẹp",
                        Content = "Những địa điểm không thể bỏ qua mùa hè này để tận hưởng không khí trong lành, làn nước trong xanh và cát trắng nắng vàng.",
                        ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop",
                        CategoryId = travelCat?.Id ?? 2,
                        CreatedDate = new DateTime(2026, 4, 2)
                    },
                    new Post
                    {
                        Title = "Chạy bộ đúng cách",
                        Content = "Lợi ích tuyệt vời của việc chạy bộ mỗi sáng giúp tăng cường sức khỏe tim mạch, cải thiện vóc dáng và giải tỏa stress.",
                        ImageUrl = "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop",
                        CategoryId = sportCat?.Id ?? 3,
                        CreatedDate = new DateTime(2026, 4, 3)
                    },
                    new Post
                    {
                        Title = "AI và tương lai",
                        Content = "Trí tuệ nhân tạo đang thay đổi cuộc sống và cách chúng ta làm việc một cách chóng mặt. Hãy cùng khám phá tương lai của AI.",
                        ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop",
                        CategoryId = techCat?.Id ?? 1,
                        CreatedDate = new DateTime(2026, 4, 4)
                    },
                    new Post
                    {
                        Title = "Kỹ năng Teamwork",
                        Content = "Cách phối hợp hiệu quả trong nhóm đồ án giúp mọi thành viên phát huy tối đa năng lực và đạt kết quả tốt nhất.",
                        ImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
                        CategoryId = eduCat?.Id ?? 4,
                        CreatedDate = new DateTime(2026, 4, 5)
                    }
                };
                context.Posts.AddRange(posts);
                context.SaveChanges();
            }

            // Hot-swap existing placeholder image paths with premium Unsplash image URLs
            if (context.Posts.Any(p => p.ImageUrl.Contains("/img/")))
            {
                var postsList = context.Posts.ToList();
                foreach (var post in postsList)
                {
                    if (post.ImageUrl.Contains("dotnet.jpg")) post.ImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop";
                    else if (post.ImageUrl.Contains("beach.jpg")) post.ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop";
                    else if (post.ImageUrl.Contains("run.jpg")) post.ImageUrl = "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop";
                    else if (post.ImageUrl.Contains("ai.jpg")) post.ImageUrl = "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop";
                    else if (post.ImageUrl.Contains("team.jpg")) post.ImageUrl = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop";
                }
                context.SaveChanges();
            }

            // 3. Seed Users
            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User { Username = "admin", PasswordHash = "123456", FullName = "Quản trị viên hệ thống", Role = "Admin" },
                    new User { Username = "thai_gv", PasswordHash = "thai1969", FullName = "Nguyễn Cao Thái", Role = "Editor" },
                    new User { Username = "sv_01", PasswordHash = "student1", FullName = "Nguyễn Văn A", Role = "User" },
                    new User { Username = "sv_02", PasswordHash = "student2", FullName = "Trần Thị B", Role = "User" },
                    new User { Username = "moderator", PasswordHash = "mod789", FullName = "Lê Văn C", Role = "Moderator" }
                };
                context.Users.AddRange(users);
                context.SaveChanges();
            }

            // 4. Seed CategoryProduct
            if (!context.CategoriesProducts.Any())
            {
                var productCategories = new List<CategoryProduct>
                {
                    new CategoryProduct { Name = "Điện thoại & Máy tính bảng", Description = "Các dòng thiết bị di động, tablet thông minh mới nhất" },
                    new CategoryProduct { Name = "Laptop & Thiết bị văn phòng", Description = "Máy tính xách tay và các linh kiện phục vụ làm việc & giải trí" },
                    new CategoryProduct { Name = "Phụ kiện công nghệ", Description = "Tai nghe, chuột, bàn phím và dây sạc chất lượng cao" },
                    new CategoryProduct { Name = "Đồng hồ thông minh", Description = "Smartwatch và thiết bị đeo tay theo dõi sức khỏe" },
                    new CategoryProduct { Name = "Màn hình & TV", Description = "Màn hình máy tính, TV thông minh các kích thước" }
                };
                context.CategoriesProducts.AddRange(productCategories);
                context.SaveChanges();
            }

            // 5. Seed Product — bổ sung sản phẩm nếu chưa đủ 15 sản phẩm
            var mobileCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Điện thoại & Máy tính bảng");
            var laptopCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Laptop & Thiết bị văn phòng");
            var accessoryCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Phụ kiện công nghệ");
            var watchCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Đồng hồ thông minh");
            var tvCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Màn hình & TV");

            var allNewProducts = new List<Product>
            {
                // === Điện thoại ===
                new Product { Name = "iPhone 15 Pro Max", Price = 29990000, StockQuantity = 50, ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop", Description = "Siêu phẩm Apple 2024 bộ nhớ 256GB vỏ Titan siêu nhẹ", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "Samsung Galaxy S24 Ultra", Price = 26990000, StockQuantity = 40, ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop", Description = "Thiết kế vuông vức cùng bút S-Pen và tính năng Galaxy AI đột phá", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "Google Pixel 8 Pro", Price = 22490000, StockQuantity = 25, ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop", Description = "Camera AI hàng đầu thế giới, trải nghiệm Android thuần khiết", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "Xiaomi 14 Ultra", Price = 19990000, StockQuantity = 35, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop", Description = "Flagship Xiaomi với camera Leica chuyên nghiệp, sạc nhanh 90W", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "iPad Pro M4 12.9 inch", Price = 32990000, StockQuantity = 18, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop", Description = "Máy tính bảng mỏng nhất thế giới với chip M4 cực mạnh", CategoryProductId = mobileCat?.Id ?? 1 },

                // === Laptop ===
                new Product { Name = "Macbook Pro M3 v2", Price = 39990000, StockQuantity = 15, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop", Description = "Apple Silicon M3 cực mạnh cho lập trình viên và đồ họa chuyên nghiệp", CategoryProductId = laptopCat?.Id ?? 2 },
                new Product { Name = "Dell XPS 13 2323", Price = 34500000, StockQuantity = 12, ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop", Description = "Laptop ultrabook doanh nhân siêu mỏng nhẹ màn hình vô cực", CategoryProductId = laptopCat?.Id ?? 2 },
                new Product { Name = "ASUS ROG Strix G16", Price = 28990000, StockQuantity = 20, ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop", Description = "Laptop gaming RTX 4060, màn hình 165Hz, tản nhiệt siêu mát", CategoryProductId = laptopCat?.Id ?? 2 },
                new Product { Name = "Lenovo ThinkPad X1 Carbon", Price = 31500000, StockQuantity = 8, ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop", Description = "Laptop doanh nhân bền bỉ chuẩn quân đội, bàn phím huyền thoại", CategoryProductId = laptopCat?.Id ?? 2 },

                // === Phụ kiện ===
                new Product { Name = "Tai nghe AirPods Pro 2", Price = 5990000, StockQuantity = 100, ImageUrl = "https://images.unsplash.com/photo-1588449668338-d1345b11a4f1?w=800&auto=format&fit=crop", Description = "Chống ồn chủ động vượt trội và âm thanh vòm sống động", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Bàn phím cơ Keychron K8", Price = 2490000, StockQuantity = 60, ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop", Description = "Bàn phím cơ không dây hot-swap, switch Gateron, đèn RGB", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Chuột Logitech MX Master 3S", Price = 2290000, StockQuantity = 45, ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop", Description = "Chuột ergonomic cao cấp, cuộn siêu nhanh, kết nối 3 thiết bị", CategoryProductId = accessoryCat?.Id ?? 3 },

                // === Đồng hồ ===
                new Product { Name = "Apple Watch Ultra 2", Price = 21990000, StockQuantity = 22, ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop", Description = "Đồng hồ thông minh cao cấp nhất Apple, chống nước 100m, GPS 2 tần số", CategoryProductId = watchCat?.Id ?? mobileCat?.Id ?? 1 },
                new Product { Name = "Samsung Galaxy Watch 6 Classic", Price = 8990000, StockQuantity = 30, ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop", Description = "Vòng bezel xoay cổ điển, đo huyết áp và nhịp tim chính xác", CategoryProductId = watchCat?.Id ?? mobileCat?.Id ?? 1 },

                // === Màn hình ===
                new Product { Name = "LG UltraFine 27 inch 4K", Price = 12990000, StockQuantity = 15, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop", Description = "Màn hình 4K IPS 99% sRGB, USB-C 96W, hoàn hảo cho Macbook", CategoryProductId = tvCat?.Id ?? laptopCat?.Id ?? 2 },
                new Product { Name = "Samsung Smart TV 55 inch QLED", Price = 15490000, StockQuantity = 10, ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop", Description = "TV QLED 4K, Tizen OS, hỗ trợ AirPlay 2 và SmartThings", CategoryProductId = tvCat?.Id ?? laptopCat?.Id ?? 2 },
            };

            foreach (var newProd in allNewProducts)
            {
                if (!context.Products.Any(p => p.Name == newProd.Name))
                {
                    context.Products.Add(newProd);
                }
            }
            context.SaveChanges();

            // Hot-swap existing placeholder image paths with premium Unsplash image URLs for Products
            if (context.Products.Any(p => p.ImageUrl.Contains("/img/")))
            {
                var productsList = context.Products.ToList();
                foreach (var prod in productsList)
                {
                    if (prod.ImageUrl.Contains("iphone.jpg")) prod.ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop";
                    else if (prod.ImageUrl.Contains("s24.jpg")) prod.ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop";
                    else if (prod.ImageUrl.Contains("macbook.jpg")) prod.ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop";
                    else if (prod.ImageUrl.Contains("dell.jpg")) prod.ImageUrl = "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop";
                    else if (prod.ImageUrl.Contains("airpods.jpg")) prod.ImageUrl = "https://images.unsplash.com/photo-1588449668338-d1345b11a4f1?w=800&auto=format&fit=crop";
                }
                context.SaveChanges();
            }

            // 6. Seed Customer
            if (!context.Customers.Any())
            {
                var customers = new List<Customer>
                {
                    new Customer { FullName = "La Quang Triều", Email = "trieu@gmail.com", Phone = "0987654321", Address = "93 Cao Thắng, Quận 3, TP.HCM", Password = "123" },
                    new Customer { FullName = "Nguyễn Cao Thái", Email = "thai@cms.edu.vn", Phone = "0909123456", Address = "Quy Nhơn, Bình Định", Password = "123" }
                };
                context.Customers.AddRange(customers);
                context.SaveChanges();
            }

            // 7. Seed Order
            if (!context.Orders.Any())
            {
                var trieu = context.Customers.FirstOrDefault(c => c.Email == "trieu@gmail.com");
                var thai = context.Customers.FirstOrDefault(c => c.Email == "thai@cms.edu.vn");

                var orders = new List<Order>
                {
                    new Order { CustomerId = trieu?.Id ?? 1, Status = 0, OrderDate = DateTime.Now.AddHours(-5), Notes = "Giao hàng vào giờ hành chính, vui lòng gọi trước." },
                    new Order { CustomerId = thai?.Id ?? 2, Status = 2, OrderDate = DateTime.Now.AddDays(-2), Notes = "Khách hàng thân thiết." }
                };
                context.Orders.AddRange(orders);
                context.SaveChanges();
            }

            // 8. Seed OrderDetail
            if (!context.OrderDetails.Any())
            {
                var order1 = context.Orders.FirstOrDefault(o => o.Notes.Contains("giờ hành chính"));
                var order2 = context.Orders.FirstOrDefault(o => o.Notes.Contains("thân thiết"));
                var ip = context.Products.FirstOrDefault(p => p.Name == "iPhone 15 Pro Max");
                var mac = context.Products.FirstOrDefault(p => p.Name == "Macbook Pro M3");

                var details = new List<OrderDetail>
                {
                    new OrderDetail { OrderId = order1?.Id ?? 1, ProductId = ip?.Id ?? 1, Quantity = 1, UnitPrice = ip?.Price ?? 29990000 },
                    new OrderDetail { OrderId = order2?.Id ?? 2, ProductId = mac?.Id ?? 3, Quantity = 2, UnitPrice = mac?.Price ?? 39990000 }
                };
                context.OrderDetails.AddRange(details);
                context.SaveChanges();
            }
        }
    }
}
