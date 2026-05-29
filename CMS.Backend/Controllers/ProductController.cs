using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.Products.Include(p => p.CategoryProduct).ToList();
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
        public IActionResult Create(Product model)
        {
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
        public IActionResult Edit(Product model)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CategoryProductList = new SelectList(_context.CategoriesProducts, "Id", "Name", model.CategoryProductId);
            return View(model);
        }

        // Action to delete product by ID
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
