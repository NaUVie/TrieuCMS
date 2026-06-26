using System;
using System.Collections.Generic;
using System.Linq;
using CMS.Data.Entities;
using CMS.Data.Security;

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
            if (!context.Posts.Any(p => p.Title.Contains("custom bàn phím cơ")))
            {
                // Clear any existing posts to ensure we get the gaming/tech posts
                var oldPosts = context.Posts.ToList();
                if (oldPosts.Any())
                {
                    context.Posts.RemoveRange(oldPosts);
                    context.SaveChanges();
                }

                // Retrieve actual Category IDs after insertion
                var techCat = context.Categories.FirstOrDefault(c => c.Name == "Tin tức Công nghệ");
                if (techCat != null)
                {
                    techCat.Description = "Cập nhật xu hướng công nghệ, linh kiện PC và Gaming Gear.";
                    context.SaveChanges();
                }

                var posts = new List<Post>
                {
                    new Post
                    {
                        Title = "Hướng dẫn custom bàn phím cơ cho người mới",
                        Content = "Custom bàn phím cơ đang trở thành xu hướng cực hot. Bài viết này hướng dẫn chi tiết cách chọn switch (linear, tactile, clicky), cách lube switch, lót foam tiêu âm và chọn keycap hoàn hảo để có trải nghiệm gõ phím êm ái nhất.",
                        ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop",
                        CategoryId = techCat?.Id ?? 1,
                        CreatedDate = DateTime.Now.AddDays(-1)
                    },
                    new Post
                    {
                        Title = "Top chuột gaming dưới 1 triệu đáng mua nhất",
                        Content = "Điểm danh top 5 mẫu chuột chơi game phân khúc dưới 1 triệu đồng sở hữu cảm biến quang học PixArt cực nhạy, độ bền switch cơ học trên 50 triệu lần nhấn và thiết kế công thái học đỉnh cao dành cho game thủ FPS và MOBA.",
                        ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop",
                        CategoryId = techCat?.Id ?? 1,
                        CreatedDate = DateTime.Now.AddDays(-2)
                    },
                    new Post
                    {
                        Title = "Cách chọn tai nghe Gaming Gear chuẩn Esport chuyên nghiệp",
                        Content = "Tai nghe gaming đóng vai trò cốt lõi trong việc nhận diện hướng tiếng bước chân kẻ địch trong các trận đấu súng. Tìm hiểu tầm quan trọng của âm thanh vòm 7.1 và lý do vì sao màng loa Neodymium 50mm được các game thủ chuyên nghiệp ưa chuộng.",
                        ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop",
                        CategoryId = techCat?.Id ?? 1,
                        CreatedDate = DateTime.Now.AddDays(-3)
                    },
                    new Post
                    {
                        Title = "Lót chuột LED RGB - Phụ kiện không thể thiếu góc máy gaming",
                        Content = "Một chiếc lót chuột cỡ lớn có tích hợp dải LED RGB đồng bộ ánh sáng giúp góc máy làm việc và chiến game của bạn trở nên sống động, tăng thêm 200% nguồn cảm hứng khi ngồi vào bàn máy.",
                        ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop",
                        CategoryId = techCat?.Id ?? 1,
                        CreatedDate = DateTime.Now.AddDays(-4)
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
                    new User { Username = "admin", PasswordHash = PasswordHasher.HashPassword("123456"), FullName = "Quản trị viên hệ thống", Role = "Admin" },
                    new User { Username = "thai_gv", PasswordHash = PasswordHasher.HashPassword("thai1969"), FullName = "Nguyễn Cao Thái", Role = "Editor" },
                    new User { Username = "sv_01", PasswordHash = PasswordHasher.HashPassword("student1"), FullName = "Nguyễn Văn A", Role = "User" },
                    new User { Username = "sv_02", PasswordHash = PasswordHasher.HashPassword("student2"), FullName = "Trần Thị B", Role = "User" },
                    new User { Username = "moderator", PasswordHash = PasswordHasher.HashPassword("mod789"), FullName = "Lê Văn C", Role = "Moderator" }
                };
                context.Users.AddRange(users);
                context.SaveChanges();
            }
            else
            {
                var users = context.Users.ToList();
                bool modified = false;
                foreach (var user in users)
                {
                    if (!string.IsNullOrEmpty(user.PasswordHash) && !IsHashed(user.PasswordHash))
                    {
                        user.PasswordHash = PasswordHasher.HashPassword(user.PasswordHash);
                        modified = true;
                    }
                }
                if (modified)
                {
                    context.SaveChanges();
                }
            }

            // 4. Seed CategoryProduct
            if (context.CategoriesProducts.Any())
            {
                if (!context.CategoriesProducts.Any(c => c.Name == "Tay cầm chơi game"))
                {
                    context.CategoriesProducts.Add(new CategoryProduct { Name = "Tay cầm chơi game", Description = "Tay cầm chơi game cao cấp cho PC, Console, Điện thoại" });
                    context.SaveChanges();
                }
            }
            else
            {
                var productCategories = new List<CategoryProduct>
                {
                    new CategoryProduct { Name = "Điện thoại & Máy tính bảng", Description = "Các dòng thiết bị di động, tablet thông minh mới nhất" },
                    new CategoryProduct { Name = "Laptop & Thiết bị văn phòng", Description = "Máy tính xách tay và các linh kiện phục vụ làm việc & giải trí" },
                    new CategoryProduct { Name = "Phụ kiện công nghệ", Description = "Tai nghe, chuột, bàn phím và dây sạc chất lượng cao" },
                    new CategoryProduct { Name = "Đồng hồ thông minh", Description = "Smartwatch và thiết bị đeo tay theo dõi sức khỏe" },
                    new CategoryProduct { Name = "Màn hình & TV", Description = "Màn hình máy tính, TV thông minh các kích thước" },
                    new CategoryProduct { Name = "Tay cầm chơi game", Description = "Tay cầm chơi game cao cấp cho PC, Console, Điện thoại" }
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
            var gamepadCat = context.CategoriesProducts.FirstOrDefault(c => c.Name == "Tay cầm chơi game");

            var allNewProducts = new List<Product>
            {
                // === Điện thoại ===
                new Product { Name = "iPhone 15 Pro Max", Price = 29990000, StockQuantity = 50, ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop", Description = "Siêu phẩm Apple 2024 bộ nhớ 256GB vỏ Titan siêu nhẹ", CategoryProductId = mobileCat?.Id ?? 1, IsOnSale = true, SalePrice = 27490000 },
                new Product { Name = "Samsung Galaxy S24 Ultra", Price = 26990000, StockQuantity = 40, ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop", Description = "Thiết kế vuông vức cùng bút S-Pen và tính năng Galaxy AI đột phá", CategoryProductId = mobileCat?.Id ?? 1, IsOnSale = true, SalePrice = 24990000 },
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
                new Product { Name = "Apple Watch Ultra 2", Price = 21990000, StockQuantity = 22, ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop", Description = "Đồng hồ thông minh cao cấp nhất Apple, chống nước 100m, GPS 2 tần số", CategoryProductId = watchCat?.Id ?? mobileCat?.Id ?? 1, IsOnSale = true, SalePrice = 19990000 },
                new Product { Name = "Samsung Galaxy Watch 6 Classic", Price = 8990000, StockQuantity = 30, ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop", Description = "Vòng bezel xoay cổ điển, đo huyết áp và nhịp tim chính xác", CategoryProductId = watchCat?.Id ?? mobileCat?.Id ?? 1 },

                // === Màn hình ===
                new Product { Name = "LG UltraFine 27 inch 4K", Price = 12990000, StockQuantity = 15, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop", Description = "Màn hình 4K IPS 99% sRGB, USB-C 96W, hoàn hảo cho Macbook", CategoryProductId = tvCat?.Id ?? laptopCat?.Id ?? 2 },
                new Product { Name = "Samsung Smart TV 55 inch QLED", Price = 15490000, StockQuantity = 10, ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop", Description = "TV QLED 4K, Tizen OS, hỗ trợ AirPlay 2 và SmartThings", CategoryProductId = tvCat?.Id ?? laptopCat?.Id ?? 2 },

                // === Tay cầm chơi game (Gamepads) từ HuyGamer ===
                new Product { Name = "Flydigi Apex 5 Tay Cầm Chơi Game Kết Nối Nearlink", Price = 6789000, StockQuantity = 20, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/06/Apex-5-Wuchang2.png", Description = "Tay cầm chơi game cao cấp sử dụng công nghệ kết nối Nearlink siêu tốc, độ trễ cực thấp.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 5990000 },
                new Product { Name = "SPECIAL EDITION – Flydigi Apex 5 SKIRK Genshin Impact", Price = 4199000, StockQuantity = 15, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/10/apex-5-skirk-1.webp", Description = "Phiên bản Colab Genshin Impact Skirk cực chất cho game thủ, hỗ trợ màn hình LED đa sắc.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 3690000 },
                new Product { Name = "Flydigi Apex 5 PRO SUPER SAIYAN [DragonBall Edition]", Price = 4150000, StockQuantity = 10, ImageUrl = "https://huygamer.com/wp-content/uploads/2026/02/Flydigi-Vader-5-Pro-Super-Saiyan.webp", Description = "Phiên bản DragonBall Super Saiyan độc quyền, tay cầm tối thượng cho các fan đối kháng.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 3590000 },
                new Product { Name = "Flydigi Vader 5 Pro GOKU [DragonBall Edition]", Price = 2500000, StockQuantity = 20, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/11/vader-5-pro-goku-2.webp", Description = "Tay cầm chơi game phiên bản Goku DragonBall Edition với chip Nearlink và cơ chế phản hồi rung cực mạnh.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 2190000 },
                new Product { Name = "Gamesir G7 Pro Wuchang", Price = 2099000, StockQuantity = 30, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/10/Game-sir-wuchang-1.webp", Description = "Tay cầm chơi game Gamesir G7 Pro bản collab Wuchang thiết kế độc quyền, cần Hall Effect.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 1790000 },
                new Product { Name = "Flydigi Apex 4 – Tay Cầm Gaming Cao Cấp Đáng Mua Nhất", Price = 1850000, StockQuantity = 25, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Flydigi-Apex-4-2.webp", Description = "Cần xoay điều chỉnh lực cơ học đột phá, màn hình LED hiển thị thông minh và đèn RGB.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 1690000 },
                new Product { Name = "Flydigi Vader 5 Pro [Sẵn Hàng]", Price = 1589000, StockQuantity = 35, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/11/Preorder-0D-on-Huygamer.com-Vader-5-pro-2.webp", Description = "Siêu phẩm tay cầm chơi game 2025 thế hệ mới tích hợp cần xoay cơ học đột phá.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 1390000 },
                new Product { Name = "8BitDo Rare 40th Anniversary", Price = 1550000, StockQuantity = 8, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/09/8BitDo-Rare-40th-Anniversary-6.webp", Description = "Phiên bản giới hạn kỷ niệm 40 năm của 8BitDo, thiết kế cổ điển sang trọng và độc nhất.", CategoryProductId = gamepadCat?.Id ?? 6 },
                new Product { Name = "Flydigi Vader 4 Pro – Tay Cầm Gaming Đỉnh Cao", Price = 1250000, StockQuantity = 40, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Flydigi-Vader-4-Pro-2.webp", Description = "Cần Analog Hall Effect chống trôi, phím bấm cơ học nẩy, kết nối siêu nhạy.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 990000 },
                new Product { Name = "8BitDo Ultimate 2 – Tay Cầm Gaming Cao Cấp Có Dock Sạc", Price = 1150000, StockQuantity = 22, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/8BitDo-Ultimate-2-2.webp", Description = "Trang bị cần TMR Joystick chống trôi, dock sạc thông minh tiện dụng và phím macro lưng.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 990000 },
                new Product { Name = "8BitDo Ultimate 2 Bluetooth [Switch & PC]", Price = 1150000, StockQuantity = 30, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/09/8bitdo-Ultimate-2-Bluetooth.webp", Description = "Phiên bản Bluetooth hỗ trợ hoàn hảo cho Nintendo Switch và PC, cần Hall Effect.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 990000 },
                new Product { Name = "8BitDo Ultimate 2 Wuchang Edition", Price = 1150000, StockQuantity = 15, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/08/8bbitdo-wuchang-1.webp", Description = "Tay cầm phiên bản đặc biệt Wuchang, tích hợp dock sạc và phím bấm cơ học cao cấp.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 990000 },
                new Product { Name = "Flydigi DireWolf 4 Siêu Nâng Cấp [Sẵn Hàng]", Price = 1099000, StockQuantity = 50, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/09/Flydigi-DireWolf-4-2.webp", Description = "Thế hệ Direwolf 4 nâng cấp toàn diện, cần Hall Effect chống trôi và kết nối 3 chế độ.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 950000 },
                new Product { Name = "GameSir Cyclone 2 – Thiết Kế Trong Suốt Độc Đáo", Price = 850000, StockQuantity = 45, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/game-sir-circle-2.webp", Description = "Vỏ nhựa trong suốt cực đẹp, nút bấm cơ học nẩy và cần Analog Hall Effect cao cấp.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 750000 },
                new Product { Name = "BigBigWon Gale Hall – Tay Cầm Chơi Game Siêu Nhạy", Price = 750000, StockQuantity = 25, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Galle-hall-2.webp", Description = "Hỗ trợ Polling Rate 1000Hz không dây, đế sạc nhanh đi kèm, con quay hồi chuyển 6 trục.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 650000 },
                new Product { Name = "Flydigi Direwolf 3 – Tay Cầm Tầm Trung Cực Ngon", Price = 750000, StockQuantity = 30, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Flydigi-Direwolf-3-2.webp", Description = "Tay cầm gaming quốc dân, cần Hall Effect chống trôi, phím nẩy cơ học.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 650000 },
                new Product { Name = "GULIKIT ES / ES PRO – Tay Cầm Không Dây Siêu Tốc", Price = 669000, StockQuantity = 15, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/10/TAY-CAM-GULIKIT-ES-ES-PRO-1.webp", Description = "Được mệnh danh là tay cầm không dây nhanh nhất thế giới, thiết kế tối giản, cực bền.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 590000 },
                new Product { Name = "Flydigi Dune Fox – Tay Cầm Gaming Giá Học Sinh", Price = 450000, StockQuantity = 40, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Flydigi-Dune-Fox-1.webp", Description = "Phân khúc tay cầm chơi game giá rẻ với độ bền cao và cảm giác bấm đầm tay.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 390000 },
                new Product { Name = "Bigbigwon Aether (Mojhon Aether) Giá Rẻ", Price = 450000, StockQuantity = 35, ImageUrl = "https://huygamer.com/wp-content/uploads/2025/05/Bigbigwon-Aether-Mojhon-Aether-2.webp", Description = "Thiết kế nhỏ gọn, tay cầm gaming cơ bản đáp ứng đầy đủ nhu cầu chơi game PC/Mobile.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 390000 },
                new Product { Name = "Beitong Pangu – Tay Cầm Chơi Game Cao Cấp", Price = 4500000, StockQuantity = 10, ImageUrl = "https://huygamer.com/wp-content/uploads/2026/05/Beitong-Pangu-2.webp", Description = "Đỉnh cao tay cầm chơi game với thiết kế công thái học đỉnh cao và phản hồi xúc giác tinh tế.", CategoryProductId = gamepadCat?.Id ?? 6, IsOnSale = true, SalePrice = 3990000 },

                // === Các thiết bị khác ===
                new Product { Name = "Samsung Galaxy Tab S9 Ultra", Price = 21990000, StockQuantity = 15, ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop", Description = "Máy tính bảng màn hình Dynamic AMOLED 2X 14.6 inch cực đại", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "Sony WH-1000XM5", Price = 6490000, StockQuantity = 40, ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop", Description = "Tai nghe chụp tai chống ồn đỉnh cao, thời lượng pin 30 giờ", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Bàn phím Leopold FC750R PD", Price = 3150000, StockQuantity = 25, ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop", Description = "Bàn phím cơ nhập khẩu Hàn Quốc, keycap PBT Doubleshot siêu bền", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Chuột Logitech G Pro X Superlight 2", Price = 3590000, StockQuantity = 30, ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop", Description = "Chuột chơi game không dây siêu nhẹ cho game thủ chuyên nghiệp", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Garmin Fenix 7 Pro Sapphire", Price = 17990000, StockQuantity = 12, ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop", Description = "Đồng hồ GPS thể thao cao cấp tích hợp sạc năng lượng mặt trời", CategoryProductId = watchCat?.Id ?? mobileCat?.Id ?? 1 },
                new Product { Name = "Loa Bluetooth JBL Charge 5", Price = 3490000, StockQuantity = 50, ImageUrl = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop", Description = "Loa di động kháng nước IP67, âm bass sâu rõ, pin dùng 20 giờ", CategoryProductId = accessoryCat?.Id ?? 3 },
                new Product { Name = "Oppo Find X7 Ultra", Price = 18490000, StockQuantity = 20, ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop", Description = "Điện thoại camera Hasselblad kép kính tiềm vọng thu phóng vượt trội", CategoryProductId = mobileCat?.Id ?? 1 },
                new Product { Name = "ASUS TUF Gaming VG279QL1A", Price = 6190000, StockQuantity = 15, ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop", Description = "Màn hình gaming 27 inch Full HD, IPS 165Hz chuyên nghiệp", CategoryProductId = tvCat?.Id ?? laptopCat?.Id ?? 2 },
                new Product { Name = "MacBook Air M3 13 inch", Price = 27990000, StockQuantity = 25, ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop", Description = "Thiết kế siêu mỏng nhẹ, pin 18 tiếng, hiệu năng vượt bậc với chip M3", CategoryProductId = laptopCat?.Id ?? 2 },
                new Product { Name = "Tai nghe chụp tai Marshall Major IV", Price = 3690000, StockQuantity = 35, ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop", Description = "Tai nghe không dây cổ điển biểu tượng Marshall, thời lượng pin 80 giờ", CategoryProductId = accessoryCat?.Id ?? 3 },
            };

            foreach (var newProd in allNewProducts)
            {
                var existing = context.Products.FirstOrDefault(p => p.Name == newProd.Name);
                if (existing == null)
                {
                    context.Products.Add(newProd);
                }
                else
                {
                    existing.IsOnSale = newProd.IsOnSale;
                    existing.SalePrice = newProd.SalePrice;
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

            // Defensive check: Force update gamepad image paths to correct local file names
            // Cleanup: Delete old gamepads that are no longer in our list (only if not ordered)
            if (gamepadCat != null)
            {
                var existingGamepads = context.Products.Where(p => p.CategoryProductId == gamepadCat.Id).ToList();
                var newGamepadNames = new HashSet<string>
                {
                    "Flydigi Apex 5 Tay Cầm Chơi Game Kết Nối Nearlink",
                    "SPECIAL EDITION – Flydigi Apex 5 SKIRK Genshin Impact",
                    "Flydigi Apex 5 PRO SUPER SAIYAN [DragonBall Edition]",
                    "Flydigi Vader 5 Pro GOKU [DragonBall Edition]",
                    "Gamesir G7 Pro Wuchang",
                    "Flydigi Apex 4 – Tay Cầm Gaming Cao Cấp Đáng Mua Nhất",
                    "Flydigi Vader 5 Pro [Sẵn Hàng]",
                    "8BitDo Rare 40th Anniversary",
                    "Flydigi Vader 4 Pro – Tay Cầm Gaming Đỉnh Cao",
                    "8BitDo Ultimate 2 – Tay Cầm Gaming Cao Cấp Có Dock Sạc",
                    "8BitDo Ultimate 2 Bluetooth [Switch & PC]",
                    "8BitDo Ultimate 2 Wuchang Edition",
                    "Flydigi DireWolf 4 Siêu Nâng Cấp [Sẵn Hàng]",
                    "GameSir Cyclone 2 – Thiết Kế Trong Suốt Độc Đáo",
                    "BigBigWon Gale Hall – Tay Cầm Chơi Game Siêu Nhạy",
                    "Flydigi Direwolf 3 – Tay Cầm Tầm Trung Cực Ngon",
                    "GULIKIT ES / ES PRO – Tay Cầm Không Dây Siêu Tốc",
                    "Flydigi Dune Fox – Tay Cầm Gaming Giá Học Sinh",
                    "Bigbigwon Aether (Mojhon Aether) Giá Rẻ",
                    "Beitong Pangu – Tay Cầm Chơi Game Cao Cấp"
                };

                foreach (var prod in existingGamepads)
                {
                    if (!newGamepadNames.Contains(prod.Name))
                    {
                        bool isReferenced = context.OrderDetails.Any(od => od.ProductId == prod.Id);
                        if (!isReferenced)
                        {
                            context.Products.Remove(prod);
                        }
                    }
                }
                context.SaveChanges();
            }


            // 6. Seed Customer
            if (!context.Customers.Any())
            {
                var customers = new List<Customer>
                {
                    new Customer { FullName = "La Quang Triều", Email = "trieu@gmail.com", Phone = "0987654321", Address = "63/6 đường 2, Phường Tăng Nhơn Phú B, TP Thủ Đức, TP. Hồ Chí Minh", Password = PasswordHasher.HashPassword("123") },
                    new Customer { FullName = "Nguyễn Cao Thái", Email = "thai@cms.edu.vn", Phone = "0909123456", Address = "Quy Nhơn, Bình Định", Password = PasswordHasher.HashPassword("123") }
                };
                context.Customers.AddRange(customers);
                context.SaveChanges();
            }
            else
            {
                var customers = context.Customers.ToList();
                bool modified = false;
                foreach (var customer in customers)
                {
                    if (!string.IsNullOrEmpty(customer.Password) && !IsHashed(customer.Password))
                    {
                        customer.Password = PasswordHasher.HashPassword(customer.Password);
                        modified = true;
                    }
                }
                if (modified)
                {
                    context.SaveChanges();
                }
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

            // 9. Seed Advertisements
            if (!context.Advertisements.Any())
            {
                var banners = new List<Advertisement>
                {
                    new Advertisement
                    {
                        Title = "Săn Deal iPhone 15 Pro Max",
                        SubTitle = "Giá chỉ từ 29.990.000đ. Nhập mã TRIEU2026 giảm thêm 1 triệu đồng.",
                        ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop",
                        LinkUrl = "#shop",
                        Status = 1,
                        CreatedDate = DateTime.Now
                    },
                    new Advertisement
                    {
                        Title = "Laptop Gaming ASUS ROG Strix G16",
                        SubTitle = "Đồ họa đỉnh cao RTX 4060. Tặng kèm chuột ROG Pugio II cực chất.",
                        ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop",
                        LinkUrl = "#shop",
                        Status = 1,
                        CreatedDate = DateTime.Now.AddDays(-1)
                    },
                    new Advertisement
                    {
                        Title = "Đồng Hồ Apple Watch Ultra 2",
                        SubTitle = "Định vị GPS 2 tần số siêu chính hãng. Bảo hành vàng 18 tháng.",
                        ImageUrl = "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=1200&auto=format&fit=crop",
                        LinkUrl = "#shop",
                        Status = 1,
                        CreatedDate = DateTime.Now.AddDays(-2)
                    }
                };
                context.Advertisements.AddRange(banners);
                context.SaveChanges();
            }
        }

        private static bool IsHashed(string password)
        {
            if (string.IsNullOrEmpty(password) || password.Length != 64)
            {
                return false;
            }
            try
            {
                var bytes = Convert.FromBase64String(password);
                return bytes.Length == 48;
            }
            catch
            {
                return false;
            }
        }
    }
}
