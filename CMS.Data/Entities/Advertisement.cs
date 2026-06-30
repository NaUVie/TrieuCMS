using System;

namespace CMS.Data.Entities
{
    public class Advertisement
    {
        public int Id { get; set; }
        public string Title { get; set; } // Tiêu đề banner (vd: iPhone 15 Pro Max)
        public string? SubTitle { get; set; } // Dòng giới thiệu phụ (vd: Giảm giá sốc mùa hè)
        public string ImageUrl { get; set; } // Đường dẫn ảnh banner
        public string? LinkUrl { get; set; } // Đường dẫn chuyển trang khi bấm (vd: /shop)
        public int Status { get; set; } // Trạng thái: 0: Ẩn, 1: Hiển thị
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
