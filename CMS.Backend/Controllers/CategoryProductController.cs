using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;
using CMS.Data;
using System.Linq;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var list = _context.CategoriesProducts.ToList();
            return View(list);
        }

        // 1. GET: Create CategoryProduct Form
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 2. POST: Handle CategoryProduct creation
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // 3. GET: Load CategoryProduct for editing
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct == null) return NotFound();
            return View(categoryProduct);
        }

        // 4. POST: Handle CategoryProduct edits
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // Action to delete product category by ID
        public IActionResult Delete(int id)
        {
            var categoryProduct = _context.CategoriesProducts.Find(id);
            if (categoryProduct != null)
            {
                _context.CategoriesProducts.Remove(categoryProduct);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
