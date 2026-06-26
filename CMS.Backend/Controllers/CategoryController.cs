using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
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

        // 1. Hàm GET: Dùng để hiển thị giao diện Form cho nhập
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Category model)
        {
            if (ModelState.IsValid)
            {
                // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
                _context.Categories.Add(model);

                // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
                _context.SaveChanges();

                // Sau khi lưu thành công, tự động quay về trang danh sách
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 3. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo Id
            var category = _context.Categories.Find(id);

            if (category == null) return NotFound();

            return View(category); // Gửi đối tượng tìm được sang giao diện Edit
        }

        // 4. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            if (ModelState.IsValid)
            {
                // Lệnh cập nhật đối tượng vào bộ nhớ tạm
                _context.Categories.Update(model);

                // Lưu thay đổi thực sự xuống SQL Server
                _context.SaveChanges();

                // Quay lại trang danh sách để xem kết quả
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 5. Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category != null)
            {
                // Find all posts in this category and set CategoryId to null
                var posts = _context.Posts.Where(p => p.CategoryId == id).ToList();
                foreach (var post in posts)
                {
                    post.CategoryId = null;
                }

                _context.Categories.Remove(category);
                _context.SaveChanges();
                TempData["Success"] = "Đã xóa danh mục bài viết thành công! Các bài viết thuộc danh mục này hiện đã được chuyển về trạng thái Không có danh mục.";
            }

            // Sau khi xóa xong, quay lại trang danh sách để cập nhật giao diện
            return RedirectToAction("Index");
        }
    }
}
