using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection: Tiêm kết nối vào Controller
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // Lấy danh sách Người dùng từ Database
            var users = _context.Users.ToList();
            return View(users);
        }
    }
}
