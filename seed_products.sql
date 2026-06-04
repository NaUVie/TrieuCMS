-- =============================================
-- Script bổ sung dữ liệu cho Database TrieuCMS_DB
-- Chạy trong SQL Server Management Studio
-- =============================================

USE [TrieuCMS_DB]
GO

-- 1. Thêm danh mục sản phẩm mới (nếu chưa có)
IF NOT EXISTS (SELECT 1 FROM CategoriesProducts WHERE Name = N'Đồng hồ thông minh')
    INSERT INTO CategoriesProducts (Name, Description) VALUES (N'Đồng hồ thông minh', N'Smartwatch và thiết bị đeo tay theo dõi sức khỏe')

IF NOT EXISTS (SELECT 1 FROM CategoriesProducts WHERE Name = N'Màn hình & TV')
    INSERT INTO CategoriesProducts (Name, Description) VALUES (N'Màn hình & TV', N'Màn hình máy tính, TV thông minh các kích thước')
GO

-- 2. Lấy Id các danh mục
DECLARE @MobileCatId INT = (SELECT TOP 1 Id FROM CategoriesProducts WHERE Name LIKE N'%Điện thoại%')
DECLARE @LaptopCatId INT = (SELECT TOP 1 Id FROM CategoriesProducts WHERE Name LIKE N'%Laptop%')
DECLARE @AccessoryCatId INT = (SELECT TOP 1 Id FROM CategoriesProducts WHERE Name LIKE N'%Phụ kiện%')
DECLARE @WatchCatId INT = (SELECT TOP 1 Id FROM CategoriesProducts WHERE Name LIKE N'%Đồng hồ%')
DECLARE @TVCatId INT = (SELECT TOP 1 Id FROM CategoriesProducts WHERE Name LIKE N'%Màn hình%')

-- Fallback nếu danh mục không tồn tại
SET @MobileCatId = ISNULL(@MobileCatId, 1)
SET @LaptopCatId = ISNULL(@LaptopCatId, 2)
SET @AccessoryCatId = ISNULL(@AccessoryCatId, 3)
SET @WatchCatId = ISNULL(@WatchCatId, @MobileCatId)
SET @TVCatId = ISNULL(@TVCatId, @LaptopCatId)

-- 3. Thêm sản phẩm mới (bỏ qua nếu đã tồn tại)

-- === ĐIỆN THOẠI ===
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Google Pixel 8 Pro')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Google Pixel 8 Pro', 22490000, 25, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop', N'Camera AI hàng đầu thế giới, trải nghiệm Android thuần khiết', @MobileCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Xiaomi 14 Ultra')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Xiaomi 14 Ultra', 19990000, 35, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop', N'Flagship Xiaomi với camera Leica chuyên nghiệp, sạc nhanh 90W', @MobileCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'iPad Pro M4 12.9 inch')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'iPad Pro M4 12.9 inch', 32990000, 18, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop', N'Máy tính bảng mỏng nhất thế giới với chip M4 cực mạnh', @MobileCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'OPPO Find X7 Ultra')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'OPPO Find X7 Ultra', 23990000, 28, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop', N'Camera Hasselblad kép, sạc nhanh 100W SuperVOOC', @MobileCatId)

-- === LAPTOP ===
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'ASUS ROG Strix G16')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'ASUS ROG Strix G16', 28990000, 20, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop', N'Laptop gaming RTX 4060, màn hình 165Hz, tản nhiệt siêu mát', @LaptopCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Lenovo ThinkPad X1 Carbon')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Lenovo ThinkPad X1 Carbon', 31500000, 8, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop', N'Laptop doanh nhân bền bỉ chuẩn quân đội, bàn phím huyền thoại', @LaptopCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'HP Spectre x360 14')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'HP Spectre x360 14', 33500000, 10, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop', N'Laptop 2-in-1 cao cấp, màn hình OLED 3K, bút stylus đi kèm', @LaptopCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Macbook Air M3 15 inch')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Macbook Air M3 15 inch', 32990000, 22, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop', N'Siêu mỏng siêu nhẹ, pin 18 giờ, chip M3 thế hệ mới', @LaptopCatId)

-- === PHỤ KIỆN ===
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Bàn phím cơ Keychron K8')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Bàn phím cơ Keychron K8', 2490000, 60, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop', N'Bàn phím cơ không dây hot-swap, switch Gateron, đèn RGB', @AccessoryCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Chuột Logitech MX Master 3S')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Chuột Logitech MX Master 3S', 2290000, 45, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop', N'Chuột ergonomic cao cấp, cuộn siêu nhanh, kết nối 3 thiết bị', @AccessoryCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Sạc nhanh Anker 65W GaN')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Sạc nhanh Anker 65W GaN', 890000, 150, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop', N'Bộ sạc GaN nhỏ gọn 3 cổng, sạc được cả Macbook lẫn điện thoại', @AccessoryCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Loa Bluetooth JBL Charge 5')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Loa Bluetooth JBL Charge 5', 3490000, 40, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop', N'Loa di động chống nước IP67, pin 20 giờ, công suất 40W', @AccessoryCatId)

-- === ĐỒNG HỒ THÔNG MINH ===
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Apple Watch Ultra 2')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Apple Watch Ultra 2', 21990000, 22, 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop', N'Đồng hồ thông minh cao cấp nhất Apple, chống nước 100m, GPS 2 tần số', @WatchCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Samsung Galaxy Watch 6 Classic')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Samsung Galaxy Watch 6 Classic', 8990000, 30, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop', N'Vòng bezel xoay cổ điển, đo huyết áp và nhịp tim chính xác', @WatchCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Garmin Venu 3')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Garmin Venu 3', 11990000, 15, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop', N'Smartwatch thể thao cao cấp, GPS đa băng tần, pin 14 ngày', @WatchCatId)

-- === MÀN HÌNH & TV ===
IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'LG UltraFine 27 inch 4K')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'LG UltraFine 27 inch 4K', 12990000, 15, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop', N'Màn hình 4K IPS 99% sRGB, USB-C 96W, hoàn hảo cho Macbook', @TVCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Samsung Smart TV 55 inch QLED')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Samsung Smart TV 55 inch QLED', 15490000, 10, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop', N'TV QLED 4K, Tizen OS, hỗ trợ AirPlay 2 và SmartThings', @TVCatId)

IF NOT EXISTS (SELECT 1 FROM Products WHERE Name = N'Dell UltraSharp 32 inch 4K')
    INSERT INTO Products (Name, Price, StockQuantity, ImageUrl, Description, CategoryProductId) 
    VALUES (N'Dell UltraSharp 32 inch 4K', 16990000, 8, 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop', N'Màn hình thiết kế đồ họa chuyên nghiệp, IPS Black, 98% DCI-P3', @TVCatId)

PRINT N'✅ Đã thêm thành công tất cả sản phẩm mới vào Database TrieuCMS_DB!'
PRINT N'📊 Tổng số sản phẩm hiện tại:'
SELECT COUNT(*) AS [Tổng sản phẩm] FROM Products
GO
