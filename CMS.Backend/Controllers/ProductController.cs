using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;
using System;
using System.IO;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.Hosting;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ProductController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        public IActionResult Index(string? searchTerm, int? categoryId, string? onSaleStatus, string? stockStatus, int page = 1)
        {
            if (page < 1) page = 1;
            int pageSize = 6; // Hiển thị 6 sản phẩm mỗi trang

            var query = _context.Products.Include(p => p.CategoryProduct).AsQueryable();

            // 1. Filter by searchTerm
            if (!string.IsNullOrEmpty(searchTerm))
            {
                var term = searchTerm.Trim().ToLower();
                query = query.Where(p => p.Name.ToLower().Contains(term) || (p.Description != null && p.Description.ToLower().Contains(term)));
            }

            // 2. Filter by categoryId
            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryProductId == categoryId.Value);
            }

            // 3. Filter by onSaleStatus
            if (!string.IsNullOrEmpty(onSaleStatus))
            {
                if (onSaleStatus == "onsale")
                {
                    query = query.Where(p => p.IsOnSale);
                }
                else if (onSaleStatus == "regular")
                {
                    query = query.Where(p => !p.IsOnSale);
                }
            }

            // 4. Filter by stockStatus
            if (!string.IsNullOrEmpty(stockStatus))
            {
                if (stockStatus == "instock")
                {
                    query = query.Where(p => p.StockQuantity > 20);
                }
                else if (stockStatus == "lowstock")
                {
                    query = query.Where(p => p.StockQuantity > 0 && p.StockQuantity <= 20);
                }
                else if (stockStatus == "outofstock")
                {
                    query = query.Where(p => p.StockQuantity == 0);
                }
            }

            int totalRecords = query.Count();
            int totalPages = (int)Math.Ceiling((double)totalRecords / pageSize);

            if (page > totalPages && totalPages > 0) page = totalPages;

            var list = query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;
            ViewBag.PageSize = pageSize;

            // Pass parameters to ViewBag for preserving search/filter values in UI
            ViewBag.SearchTerm = searchTerm;
            ViewBag.CategoryId = categoryId;
            ViewBag.OnSaleStatus = onSaleStatus;
            ViewBag.StockStatus = stockStatus;

            // Load Categories list for dropdown selection
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", categoryId);

            return View(list);
        }

        // 1. GET: Create Product Form
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name");
            return View();
        }

        // 2. POST: Handle Product creation
        [HttpPost]
        public IActionResult Create(Product model, IFormFile? ImageFile)
        {
            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = SaveUploadedFile(ImageFile);
            }
            ModelState.Remove("ImageUrl");
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageFile");

            if (string.IsNullOrEmpty(model.ImageUrl) && (ImageFile == null || ImageFile.Length == 0))
            {
                ModelState.AddModelError("ImageFile", "Hình ảnh sản phẩm không được để trống.");
            }

            if (model.IsOnSale)
            {
                if (model.SalePrice <= 0)
                {
                    ModelState.AddModelError("SalePrice", "Giá khuyến mãi phải lớn hơn 0 khi chọn sản phẩm đang giảm giá.");
                }
                else if (model.SalePrice >= model.Price)
                {
                    ModelState.AddModelError("SalePrice", "Giá khuyến mãi phải nhỏ hơn giá bán gốc.");
                }
            }
            else
            {
                model.SalePrice = 0;
            }

            if (ModelState.IsValid)
            {
                _context.Products.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // 3. GET: Load Product for editing
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", product.CategoryProductId);
            return View(product);
        }

        // 4. POST: Handle Product edits
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile? ImageFile)
        {
            var existingProduct = _context.Products.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
            if (existingProduct == null) return NotFound();

            if (ImageFile != null && ImageFile.Length > 0)
            {
                model.ImageUrl = SaveUploadedFile(ImageFile);
            }
            else
            {
                model.ImageUrl = existingProduct.ImageUrl;
            }
            ModelState.Remove("ImageUrl");
            ModelState.Remove("CategoryProduct");
            ModelState.Remove("ImageFile");

            if (model.IsOnSale)
            {
                if (model.SalePrice <= 0)
                {
                    ModelState.AddModelError("SalePrice", "Giá khuyến mãi phải lớn hơn 0 khi chọn sản phẩm đang giảm giá.");
                }
                else if (model.SalePrice >= model.Price)
                {
                    ModelState.AddModelError("SalePrice", "Giá khuyến mãi phải nhỏ hơn giá bán gốc.");
                }
            }
            else
            {
                model.SalePrice = 0;
            }

            if (ModelState.IsValid)
            {
                _context.Products.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        private string SaveUploadedFile(IFormFile file)
        {
            if (file == null || file.Length == 0) return null;

            string uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }

            return "/uploads/" + uniqueFileName;
        }

        // Action to delete product by ID
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                // Find all order details for this product and set ProductId to null
                var orderDetails = _context.OrderDetails.Where(od => od.ProductId == id).ToList();
                foreach (var od in orderDetails)
                {
                    od.ProductId = null;
                }

                _context.Products.Remove(product);
                _context.SaveChanges();
                TempData["Success"] = "Đã xóa sản phẩm thành công! Các chi tiết đơn hàng cũ liên quan hiện đã được cập nhật.";
            }
            return RedirectToAction("Index");
        }
    }
}
