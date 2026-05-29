using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System;
using System.IO;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách bài viết mẫu, hỗ trợ lọc theo danh mục
        public IActionResult Index(int? id)
        {
            IQueryable<Post> query = _context.Posts.Include(p => p.Category);
            
            if (id != null)
            {
                query = query.Where(p => p.CategoryId == id);
            }

            var posts = query.OrderByDescending(p => p.CreatedDate).ToList();
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết một bài viết
        public IActionResult Details(int id)
        {
            var post = _context.Posts.Include(p => p.Category).FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        // GET: Post/Create
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View(new Post { CreatedDate = DateTime.Now });
        }

        // POST: Post/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                ModelState.AddModelError("Title", "Tiêu đề bài viết không được để trống.");
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
                return View(model);
            }

            // Xử lý upload ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                 {
                    uploadImage.CopyTo(fileStream);
                }
                model.ImageUrl = "/uploads/" + uniqueFileName;
            }
            else if (string.IsNullOrEmpty(model.ImageUrl))
            {
                model.ImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop";
            }

            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Post/Edit/5
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Post/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                ModelState.AddModelError("Title", "Tiêu đề bài viết không được để trống.");
                ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", model.CategoryId);
                return View(model);
            }

            var dbPost = _context.Posts.Find(model.Id);
            if (dbPost == null) return NotFound();

            dbPost.Title = model.Title;
            dbPost.Content = model.Content;
            dbPost.CategoryId = model.CategoryId;
            dbPost.CreatedDate = model.CreatedDate;

            // Xử lý upload ảnh mới
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(fileStream);
                }
                dbPost.ImageUrl = "/uploads/" + uniqueFileName;
            }
            else if (!string.IsNullOrEmpty(model.ImageUrl))
            {
                dbPost.ImageUrl = model.ImageUrl;
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Post/Delete/5
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
