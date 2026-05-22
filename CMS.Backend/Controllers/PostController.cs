using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities; // Quan trọng: Phải có dòng này để dùng lớp Post
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection: Tiêm kết nối vào Controller
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách bài viết mẫu
        public IActionResult Index()
        {
            // Lấy danh sách bài viết từ Database kèm theo thông tin Danh mục
            var posts = _context.Posts.Include(p => p.Category).ToList();
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {
            // Tìm bài viết trong Database theo Id
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);

            if (post == null) return NotFound();

            return View(post);
        }
    }
}
