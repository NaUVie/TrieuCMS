using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.IO;
using System;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Hosting;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class AdvertisementController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public AdvertisementController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // Index
        public IActionResult Index()
        {
            var ads = _context.Advertisements.OrderByDescending(a => a.CreatedDate).ToList();
            return View(ads);
        }

        // GET: Create
        [HttpGet]
        public IActionResult Create()
        {
            return View(new Advertisement());
        }

        // POST: Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Advertisement model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                ModelState.AddModelError("Title", "Tiêu đề banner không được để trống.");
                return View(model);
            }

            // Xử lý upload hình ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
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
            else
            {
                model.ImageUrl = "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop";
            }

            model.CreatedDate = DateTime.Now;

            _context.Advertisements.Add(model);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Edit
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad == null) return NotFound();
            return View(ad);
        }

        // POST: Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Advertisement model, IFormFile uploadImage)
        {
            if (string.IsNullOrEmpty(model.Title))
            {
                ModelState.AddModelError("Title", "Tiêu đề banner không được để trống.");
                return View(model);
            }

            var dbAd = _context.Advertisements.Find(model.Id);
            if (dbAd == null) return NotFound();

            dbAd.Title = model.Title;
            dbAd.SubTitle = model.SubTitle;
            dbAd.LinkUrl = model.LinkUrl;
            dbAd.Status = model.Status;

            // Xử lý upload hình ảnh mới
            if (uploadImage != null && uploadImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
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
                dbAd.ImageUrl = "/uploads/" + uniqueFileName;
            }

            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }

        // GET: Delete
        public IActionResult Delete(int id)
        {
            var ad = _context.Advertisements.Find(id);
            if (ad != null)
            {
                _context.Advertisements.Remove(ad);
                _context.SaveChanges();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
