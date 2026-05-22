using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller {
        private readonly ApplicationDbContext _context;

        // Constructor Injection: Tiêm kết nối vào Controller
        public CategoryController(ApplicationDbContext context) {
            _context = context;
        }

        public IActionResult Index() {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var list = _context.Categories.ToList();
            return View(list); // Gửi danh sách này sang giao diện
        }
    }
}
