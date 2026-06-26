-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3306
-- Thời gian đã tạo: Th2 18, 2025 lúc 11:35 AM
-- Phiên bản máy phục vụ: 8.0.30
-- Phiên bản PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `laquangtrieu_2123110160`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent` tinyint DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `trash` tinyint(1) NOT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `category_name`, `slug`, `parent`, `status`, `trash`, `create_at`) VALUES
(13, 'Tay cầm cho may tinhgghfhgf', 'tay-cam-cho-may-tinh', 0, 1, 0, '2024-12-04 16:15:37'),
(14, 'Tay cầm cho điện thoại', 'tay-cam-choi-game-cho-dien-thoai', 0, 1, 0, '2024-12-06 22:30:57'),
(15, 'Tay cầm PS', 'tay-cam-ps', 0, 1, 0, '2024-12-06 22:30:57'),
(16, 'Tay cầm form Xbox', 'tay-cam-form-xbox', 13, 1, 0, '2024-12-06 22:36:15'),
(17, 'Tay cầm form PS', 'tay-cam-form-ps', 13, 1, 0, '2024-12-06 22:38:09'),
(18, 'Tay cầm dạng telescopic', 'tay-cam-telescopic', 14, 1, 0, '2024-12-06 22:39:56'),
(19, 'Tay cầm cho điện thoại form Xbox', 'tay-cam-dien-thoai-xbox', 14, 1, 0, '2024-12-06 22:40:56'),
(20, 'Tay cầm cho PS5', 'tay-cam-cho-ps5', 15, 1, 0, '2024-12-06 22:47:19'),
(21, 'Tay cầm cho PS4', 'tay-cam-cho-ps4', 15, 1, 0, '2024-12-06 22:47:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `order_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` bigint NOT NULL DEFAULT '0',
  `delivery` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `user_id`, `order_date`, `address`, `total`, `delivery`) VALUES
(16, '0c1c40bf87', 31, '2025-02-15 16:33:08', '63/6', 1150000, 1),
(17, '0d82943027', 31, '2025-02-15 18:08:41', '63/6', 21345000, 1),
(18, '3651ab036b', 31, '2025-02-17 16:34:34', '63/6', 4898000, 1),
(19, '3656ccd252', 31, '2025-02-17 16:35:56', '63/6', 12794060, 1),
(20, '37ec3cda7c', 31, '2025-02-17 18:24:03', '63/6', 17042000, 1),
(21, '38126a8a36', 31, '2025-02-17 18:34:14', '63/6', 18947000, 1),
(22, '383a5ac315', 31, '2025-02-17 18:44:53', '63/6', 9898012, 1),
(23, '384db39132', 31, '2025-02-17 18:50:03', '63/6', 14046000, 1),
(24, '38520729d6', 31, '2025-02-17 18:51:12', '63/6', 36941000, 1),
(25, '389e4d472a', 31, '2025-02-17 19:11:32', '63/6', 21390012, 1),
(26, '38d2ea2917', 31, '2025-02-17 19:25:34', '63/6', 12095000, 1),
(27, '403c458a97', 31, '2025-02-18 03:51:32', '63/6', 6499000, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_detail`
--

CREATE TABLE `order_detail` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `trash` tinyint(1) DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `order_detail`
--

INSERT INTO `order_detail` (`order_id`, `product_id`, `quantity`, `trash`, `status`) VALUES
(15, 4, 1, 0, 1),
(16, 5, 1, 0, 1),
(17, 4, 2, 0, 1),
(17, 7, 3, 0, 1),
(17, 21, 1, 0, 1),
(18, 4, 1, 0, 1),
(18, 6, 2, 0, 1),
(18, 8, 3, 0, 1),
(19, 4, 6, 0, 1),
(19, 10, 1, 0, 1),
(19, 20, 5, 0, 1),
(19, 26, 2, 0, 1),
(20, 5, 6, 0, 1),
(20, 19, 1, 0, 1),
(20, 21, 2, 0, 1),
(21, 1, 2, 0, 1),
(21, 4, 4, 0, 1),
(21, 5, 3, 0, 1),
(21, 21, 1, 0, 1),
(22, 5, 9, 0, 1),
(22, 8, 1, 0, 1),
(22, 19, 1, 0, 1),
(22, 26, 2, 0, 1),
(23, 1, 1, 0, 1),
(23, 4, 5, 0, 1),
(23, 20, 3, 0, 1),
(24, 9, 4, 0, 1),
(24, 12, 5, 0, 1),
(24, 19, 2, 0, 1),
(24, 21, 3, 0, 1),
(25, 19, 2, 0, 1),
(25, 20, 5, 0, 1),
(25, 21, 3, 0, 1),
(25, 26, 1, 0, 1),
(26, 1, 1, 0, 1),
(26, 4, 2, 0, 1),
(26, 5, 3, 0, 1),
(26, 6, 4, 0, 1),
(27, 1, 1, 0, 1),
(27, 4, 3, 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `cat_id` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` float NOT NULL,
  `description` text NOT NULL,
  `metakey` varchar(256) DEFAULT NULL,
  `metadesc` varchar(256) DEFAULT NULL,
  `is_on_sale` tinyint(1) DEFAULT '0',
  `sale_price` double NOT NULL DEFAULT '0',
  `create_at` date DEFAULT NULL,
  `trash` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `views` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `product_name`, `slug`, `cat_id`, `image`, `price`, `description`, `metakey`, `metadesc`, `is_on_sale`, `sale_price`, `create_at`, `trash`, `status`, `views`) VALUES
(1, 'Tay Cầm Flydigi Apex 4', 'tay-cam-flydigi-apex4', 16, 'apex4.jpg', 2149000, 'TÍNH NĂNG ĐỘC QUYỀN\r\n\r\n1. JOYSTICK\r\n\r\n✅ có thể điều chỉnh được lực đầu tiên trên thế giới\r\n\r\n(Có thể tùy chỉnh từ 30gf ➝ 100gf) - gf là đơn vị đo lực ấn.\r\n\r\nMặc định Xbox One có lực ấn là 55gf\r\n\r\n', NULL, NULL, 1, 1890000, NULL, 0, 1, 157),
(4, 'Tay cầm chơi game Flydigi Vader 4 Pro', 'tay-cam-vader-4-pro', 16, 'vader4pro.jpg', 1450000, 'Tay Cầm Flydigi Vader 4 Pro, 1 chiếc tay cầm bom tất ra mắt vào 28/06/2024 đã về tại shoptaycam\r\n1 mẫu tay cầm chơi game được thiết kế đặc biệt để nâng cao hiệu suất và độ chính xác. Với Polling Rate 1000Hz, mỗi lệnh của bạn sẽ được truyền tải ngay lập tức, giúp bạn vượt trội hơn trong mọi trận đấu FC Online, FIFA, PES hay bất kì tựa game nào cần độ chính xác và độ phản hồi nhanh nhất hiện nay\r\nTay Cầm Vader 4 Pro với Tính Năng Chính Vượt Trội:\r\n', NULL, NULL, 1, 879000, NULL, 0, 1, 91),
(5, 'Tay Cầm Chơi Gamesir Cyclone 2 Bản Có Dock', 'tay-cam-gamesir-cyclone-2-co-dock', 16, 'gamesircl2.jpg', 1150000, 'Tay Cầm GameSir CYCLONE 2 là sản phẩm mới ra mắt trong năm 2024 với giá bán tầm giá 1 triệu, đang là 1 trong những tay cầm đáng đồng tiền bát gạo nhất hiện nay với những đặc điểm nổi bật như:\r\n✅ Chất lượng hoàn thiện cao cấp, cảm giác bấm xịn nhất phân khúc\r\n\r\n\r\n✅ Tay Cầm Gamesir CyClone 2 gói như ảnh & video shoptaycam review bao gồm:\r\n1x TAY CẦM Gamesir Cyclone 2\r\n1x USB 2.4G\r\n1x Cáp sạc type-c dù xịn xò\r\n1x dock sạc ( với bản kèm dock, bản không dock không kèm nhá ae )\r\n1x Hướng dẫn sử dụng', NULL, NULL, 1, 656000, NULL, 0, 1, 4),
(6, 'BigBigWon Gale Hall - Tay cầm chơi game', 'tay-cam-bigbigwon-gale-hall', 16, 'galehall.jpg', 899000, 'Những Tính Năng Nổi Bật Trên Tay Cầm BigBig Won Gale Hall\r\n\r\n2 Cần Analog Hall Effect – 360 độ chống trôi\r\nPhím Trigger Hall Effect cho cảm giác bấm nhẹ nhàng và bền bỉ\r\nTrang bị rung phản hồi lực và có thể tùy chỉnh độ rung\r\nTích hợp khả năng điều chỉnh được Deadzone\r\nPolling Rate lên đến 1000Hz cho độ truyền tải dữ liệu cực nhanh, với Polling Rate lên đến 1000Hz thì đây là thông số cao bậc nhất cho 1 chiếc tay cầm ngang ngửa với Vader Pro và Apex của nhà Flydigi\r\nTích hợp đế sạc không dây, PIN 1000mAh\r\nCảm biến Gyro 6 trục\r\nKeyboard Mapping\r\n', NULL, NULL, 0, 0, NULL, 0, 1, 3),
(7, 'Tay Cầm Chơi Game GAMESIR G8 PLUS', 'tay-cam-gamesir-g8-plus', 18, 'gamesirg8p.jpg', 1399000, '– Thương hiệu Gamesir\r\n\r\n– Mã sản phẩm: G8 Plus\r\n\r\n– Cổng kết nối: Type-C\r\n\r\n– Màu sắc: Đen\r\n\r\n– Tương thích với hệ điều hành: Switch, iOs, Android, tablet và PC\r\n\r\n– Kích cỡ thiết bị tương thích: 120 – 215mm\r\n\r\n– Kết nối: Bluetooth\r\n\r\n– Pin: 1000mAh\r\n\r\n– Hall Effect Sticks: Có\r\n\r\n– Analog Triggers: Có\r\n\r\n– Bộ phím ABXY: Tuổi thọ 5 triệu lần nhấn\r\n\r\n– Trọng lượng: 314g\r\n\r\n*** Bộ sản phẩm Tay Cầm Gamesir G8 Plus bao gồm Như Ảnh shop chụp chi tiết:\r\n\r\n– 1 x Hộp đựng\r\n\r\n– 1 x Tay cầm\r\n\r\n– 1 x Sách hướng dẫn sử dụng', NULL, NULL, 0, 0, NULL, 0, 1, 0),
(8, 'Tay cầm chơi game Gamwing AB01 hỗ trợ đa nền tảng tích hợp sạc nhanh và jack tai nghe 3.5mm', 'tay-cam-gamwing-ab01', 18, 'gamwingab01.jpg', 550000, 'Tay cầm chơi game Gamwing AB01 hỗ trợ đa nền tảng tích hợp hỗ trợ sạc nhanh và jack tai nghe 3.5mm \r\n\r\n------------------------------------------------------\r\n\r\n\r\n\r\nTÍNH NĂNG NỔI BẬT \r\n\r\n\r\n\r\n💥Thiết kế thông minh với khu vực thoát khí, báng cầm chắc tay và chống mồ hôi\r\n\r\n💥Sử dụng công nghệ Hall Joystick/ Hall Trigger đem lại độ chính xác cao\r\n\r\n💥Trang bị 21 nút bấm dễ dàng tùy chỉnh, D-PAD 4 hướng, cụm XYAB và mặt sau có 2 nút marco R4/L4\r\n\r\n💥Kết nối OTG qua cổng Type - C với 4 hệ điều hành: Android, Mapping Mode, IOS, Native Mode, Harmony OS, Niteno Switch\r\n\r\n\r\n', NULL, NULL, 0, 0, NULL, 0, 1, 2),
(9, 'Tay Cầm Gamesir Tarantula Pro | Tay Cầm Chơi Game dành cho IOS, Android, Switch và PC\r\n', 'tay-cam-gamesir-tarantula-pro', 17, 'gamesirt3p.jpg', 1450000, 'Tay cầm chơi game Gamesir Tarantula Pro dành IOS, Android, Switch và PC\r\n\r\n------------------------------------------------------\r\n\r\n✅Polling Rate 1000Hz, sử dụng công nghệ Công nghệ TMR (Tension Mounting Ring) đem lại độ chính xác cao\r\n✅ Hall Effect Trigger không độ trễ, phản hồi nhanh chóng\r\n✅Trang bị 9 nút tùy chỉnh chức năng\r\n✅ Dễ dàng thay đổi Hall Effect --> Micro Switch\r\n✅ Tích hợp động cơ phản hồi rung\r\n✅ Micro Switch D-pad\r\n✅ Cụm XYAB đem lại cảm giác bấm êm ái\r\n✅ Sử dụng pin 1200mAh với thời lượng sử dụng lâu dài\r\n✅ LED RGB chuẩn gaming, cực kì đẹp mắt', NULL, NULL, 1, 1230000, NULL, 0, 1, 6),
(10, 'Tay Cầm Chơi Game Bluetooth Không Dây Q300', 'tay-cam-q300', 17, 'q300.jpg', 600000, 'Khả năng tương thích đa hệ thống Hệ thống IOS 13\r\nTương thích hoàn toàn với PS4 / PS4 Pro / Slim \' cho bảng điều khiển PS3 \' cho PC-steam / cho IOS / cho điện thoại Android. Bộ điều khiển này cho phép bạn có thể chơi trò chơi bằng iPhone của mình iPad ( Hệ thốngIOS 13 Trên , chỉ hỗ trợ các trò chơi được phát triển cho bảng điều khiển ps4) .\r\n\r\n', NULL, NULL, 0, 0, NULL, 0, 1, 0),
(11, 'Tay cầm chơi game GameSir T4 Pro, hỗ trợ cả PC và điện thoại, thời lượng pin 600mAh', 'tay-cam-gamesir-t4p', 19, 't4p.jpg', 581000, 'Tay cầm chơi game GameSir T4 Pro - Gamepad thời lượng pin cao chơi cực đã\r\n\r\nTay cầm đa năng hỗ trợ cả PC và điện thoại\r\nKết nối Bluetooth 4.0, Wireless 2.4G và USB Type C\r\nThời lượng pin 600mAh, tối đa lên tới 60 giờ chơi\r\nTích hợp bộ tạo rung mạnh mẽ giúp cảm giác chân thật\r\nGamesir T4 Pro là phiên bản cao cấp nhất của dòng T4. T4 pro là bản nâng cấp hoàn toàn so với T4 và T4w. \r\nHỗ trợ chơi đa nền tảng iOS/Android/PC và đặc biệt là cả Swtich. \r\n\r\n⭐️ Đặc biệt: Vì có chuẩn MFI, do đó chơi được các game hỗ trợ tay cầm trên iOS 13.4 trở lên. \r\n------------------------------------------------------ \r\n\r\n', NULL, NULL, 0, 0, NULL, 0, 1, 2),
(12, 'Tay cầm chơi game Dareu H101x-H105', 'tay-cam-dareu-h101x', 19, 'h101x.jpg', 550000, 'Kiểu dáng tay cầm thể thao, màu sắc trẻ trung điểm tô thêm họa tiết chấm nhỏ tăng thêm tính thẩm mỹ cho sản phẩm.\r\nDung lượng pin lớn, sử dụng liên tục lên đến 25 giờ mà chỉ mất 2.5 giờ sạc đầy, sử dụng thoải mái mà không lo vấn đề bị hết pin giữa trận.\r\nTrang bị các nút bấm cơ bản cho người dùng dễ dàng sử dụng, vị trí được bố trí hợp lý cho thao tác thuận tiện.\r\nTay cầm DareU phù hợp với các hệ điều hành phổ biến hiện nay như: iOS, Android, Windows và Nitendo Switch.', NULL, NULL, 0, 0, NULL, 0, 1, 3),
(19, 'Dual Shock 4', 'tay-cam-ps4', 21, 'ds4.jpg', 749000, 'Tay Cầm Sony DualShock 4 PS4 Chĩnh Hãng Màu Xanh Midnight Blue + Cáp USB Chơi Game Tối Ưu Cho PC / FO4 / FIFA | BÁN CHẠY – FREESHIP', NULL, NULL, 0, 0, NULL, 0, 1, 0),
(20, 'Dual sense', 'tay-cam-ds5', 20, 'dualsense.jpg', 1549000, 'Tay cầm không dây Sony DualSense là một thiết bị hiện đại, mang đến cho game thủ trải nghiệm chơi game hoàn toàn mới mẻ và đầy thú vị. Với khả năng kết nối đa dạng, Sony DualSense không chỉ tương thích với các hệ máy PlayStation 5 mà còn hỗ trợ tốt cho các thiết bị di động và máy tính cá nhân. Được trang bị nhiều công nghệ tiên tiến, thiết bị hứa hẹn sẽ mang đến cho người chơi những trải nghiệm chân thực và sống động nhất.', NULL, NULL, 0, 0, NULL, 0, 1, 0),
(21, 'Dualsense Edge', 'tay-cam-ds5-e', 20, 'dualsenseedge.jpg', 5699000, 'tổng quan\r\n- Dùng để kết nối chơi game trên PS5/PC\r\n- Tích hợp đầy đủ các tính năng từ tay cầm Dualsense cùng với tính năng tùy chỉnh nâng cao.\r\n-Tùy chỉnh hành trình hai nút Trigger, điều chỉnh vùng chết của cần điều khiển, cường độ rung, độ nhạy.\r\n- Cần điều khiển có thể thay thế.\r\n- Tích hợp USB Type-C sạc nhanh\r\n- Bao gồm: Tay cầm không dây Dualsense Edge™, Cáp USB Type-C® 2.8m, các phụ kiện thay thế và sách hướng dẫn.', '', '', 0, 0, NULL, 0, 1, 1),
(26, '245', '121', 13, '67b3f52c74933_q300.jpg', 12, '123', '', '', 0, 0, NULL, 0, 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `username` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date DEFAULT NULL,
  `create_at` bigint DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1',
  `trash` tinyint(1) DEFAULT '0',
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `name`, `gender`, `avatar`, `email`, `phone`, `address`, `birthday`, `create_at`, `status`, `trash`, `role`) VALUES
(31, 'admin', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2', 'ADMIN', '1', 'temp.png', 'admin@gmail.com', '0111111111', '63/6', '2005-03-25', NULL, 1, 0, 'admin'),
(32, 'ticaidu', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2', 'Trương Trần TÉ', '1', 'Ảnh chụp màn hình 2024-12-27 230110.png', 'ti@gmail.com', '1111111111', '', '2011-11-11', NULL, 1, 0, 'user'),
(34, 'bang', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2', 'Lê Hữu Bằng', '1', 'Ảnh chụp màn hình 2024-12-27 230211.png', 'b@gmail.com', '0121212121', '65122/3/23', '2011-11-25', NULL, 1, 0, 'user'),
(36, 'q123', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2', 'Hoàng Xuân Quang', '1', 'apex4.jpg', 'q@gmail.com', '0123123123', '63/6', '2000-02-14', NULL, 1, 0, 'user'),
(37, 'Huyhgjhgjhg', '6216f8a75fd5bb3d5f22b6f9958cdede3fc086c2', 'La Quang Huy', '1', 't4p.jpg', 'h@gmail.com', '0132132132', '63/7 đường 2', '2001-11-11', NULL, 1, 0, 'user');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`order_id`,`product_id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
