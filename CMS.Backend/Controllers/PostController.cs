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

        // Hàm Index: Hiển thị danh sách bài viết mẫu, hỗ trợ lọc theo danh mục
        public IActionResult Index(int? id)
        {
            // 1. Kiểm tra nếu không có id truyền vào thì lấy toàn bộ bài viết, ngược lại lọc theo id
            IQueryable<Post> query = _context.Posts.Include(p => p.Category);
            
            if (id != null)
            {
                query = query.Where(p => p.CategoryId == id);
            }

            // 2. Sắp xếp theo ngày đăng mới nhất và chuyển thành danh sách thực thi
            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();

            // 3. Truyền dữ liệu ra View
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
