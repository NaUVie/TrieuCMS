using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            var users = _context.Users.ToList();
            return View(users);
        }

        // GET: User/Create
        [HttpGet]
        public IActionResult Create()
        {
            return View(new User());
        }

        // POST: User/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(User model)
        {
            if (ModelState.IsValid)
            {
                // Kiểm tra trùng lặp tên đăng nhập
                var exists = _context.Users.Any(u => u.Username.ToLower() == model.Username.ToLower());
                if (exists)
                {
                    ModelState.AddModelError("Username", "Tên đăng nhập này đã tồn tại trong hệ thống. Vui lòng chọn tên khác.");
                    return View(model);
                }

                _context.Users.Add(model);
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: User/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: User/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(User model, string NewPassword)
        {
            if (ModelState.IsValid)
            {
                if (!string.IsNullOrEmpty(NewPassword))
                {
                    // Nếu người dùng nhập mật khẩu mới, cập nhật nó
                    model.PasswordHash = NewPassword;
                }
                else
                {
                    // Nếu để trống mật khẩu, truy vấn AsNoTracking để giữ nguyên mật khẩu cũ
                    var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);
                    if (existingUser != null)
                    {
                        model.PasswordHash = existingUser.PasswordHash;
                    }
                }

                _context.Entry(model).State = EntityState.Modified;
                _context.SaveChanges();
                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: User/Delete/5
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
